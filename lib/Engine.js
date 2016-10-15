'use strict'

const debug = require('debug')('cqrs:engine')

const Promise = require('bluebird')
const Hoek = require('hoek')
const Eraro = require('eraro')
const Errors = require('./helpers/errors')

const path = require('path')
const glob = require('glob')
const _ = require('lodash')
const uuid = require('uuid')

const Trigger = require('./Trigger')
const Command = require('./Command')
const Query = require('./Query')

let internals = {}
internals.options = {
  bus: {
    url: 'amqp://localhost:5672'
  }
}

class Engine {
  constructor (options) {
    this.uuid = uuid.v4()
    this.options = Hoek.applyToDefaults(internals.options, options || {})
    this.starttime = Date.now()
    this.services = {}
    this.triggers = {}
    this.error = Eraro({
      package: 'cqrs-framework',
      msgmap: Errors,
      override: true
    })
  }
  initialize () {
    return new Promise((resolve, reject) => {
      debug('start rabbitmq on %s', this.options.bus.url)
      this.bus = require('servicebus').bus({url: this.options.bus.url})
      this.bus.on('error', (error) => {
        return reject(this.error('engine_error_no_bus_connected', {uuid: this.uuid, type: this.type, name: this.name, error: error}))
      })
      this.bus.on('ready', () => {
        this.start().then(resolve).catch(reject)
      })
    })
  }
  start () {
    return new Promise((resolve, reject) => {
      // initialize cqrs-framework or die
      let files = []
      _.map(this.options.patterns, (pattern) => {
        let patternPath = path.resolve(this.options.source, pattern)
        let __files = glob.sync(patternPath, {mark: true, sync: true})
        files = _.union(files, __files)
      })
      if (files.length === 0) {
        return reject(this.error('engine_error_no_file', {uuid: this.uuid, type: 'Engine', name: 'Engine'}))
      }
      // load commands and queries handlers
      _.map(files, (filepath) => {
        let handler = require(filepath)
        if (typeof handler === 'function') {
          let name = _.upperFirst(_.camelCase(path.basename(filepath, '.js')))
          // add a command to services
          if (name.indexOf('Command') !== -1) {
            debug('add service command handler %s', name)
            this.services[name] = new Command(name, handler)
            this.triggers[name] = new Trigger(name)
            this.triggers[name].bind(this)
          }
          // add a query to services
          if (name.indexOf('Query') !== -1) {
            debug('add service query handler %s', name)
            this.services[name] = new Query(name, handler)
            this.triggers[name] = new Trigger(name)
            this.triggers[name].bind(this)
          }
        } else {
          debug('handler service not a function')
        }
      })
      debug('engine is ready')
      resolve()
    })
  }
  execute (name, params) {
    return new Promise((resolve, reject) => {
      const service = this.services[name]
      service.execute(params)
        .then((result) => {
          if (params && params.requester) {
            debug('(bus.send) Service-%s-%s is called with params=%o', service.name, service.uuid, params)
            // send event success on the bus
            this.bus.send(service.EventSuccess + ':' + params.requester, result)
          } else {
            debug('(bus.publish) Service-%s-%s is called with params=%o', service.name, service.uuid, params)
            // publish event success on the bus
            this.bus.publish(service.EventSuccess, result)
          }
          // return result
          resolve(result)
        })
        .catch((error) => {
          // send publish event success on the bus
          this.bus.publish(service.EventError, error)
          // return result
          reject(error)
        })
    })
  }
}

module.exports = Engine
