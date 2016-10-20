'use strict'

require('./helpers/process')

const debug = require('debug')('cqrs:server')

const Promise = require('bluebird')
const Hoek = require('hoek')
const Eraro = require('eraro')
const Errors = require('./helpers/errors')

const path = require('path')
const glob = require('glob')
const _ = require('lodash')
const uuid = require('uuid')

const Rabbus = require('./helpers/rabbus')
const Command = require('./Command')
const Query = require('./Query')

let internals = {}

internals.options = {
  connection: {
    host: 'localhost',
    port: 5672,
    timeout: 2000,
    heartbeat: 10
  }
}

class Server {
  constructor (options) {
    this.uuid = uuid.v4()
    this.options = Hoek.applyToDefaults(internals.options, options || {})
    this.starttime = Date.now()
    this.services = {}
    this.receivers = {}
    this.publishers = {}
    this.error = Eraro({
      package: 'cqrs-framework',
      msgmap: Errors,
      override: true
    })
  }
  initialize () {
    return new Promise((resolve, reject) => {
      this.rabbot = Hoek.clone(require('rabbot'))
      this.rabbot.on('unreachable', () => {
        debug('server rabbot unreachable')
        reject(this.error('server_error_no_bus_connected', {uuid: this.uuid, type: this.type, name: this.name, error: new Error('Rabbitmq unreachable')}))
      })
      this.rabbot.on('connected', () => {
        debug('server rabbot started on %s:%s', this.options.connection.host, this.options.connection.port)
        this.start().then(resolve).catch(reject)
      })
      this.rabbot
        .configure({
          connection: this.options.connection
        })
        .catch((error) => {
          debug(this.error('server_rabbot_error', {uuid: this.uuid, type: this.type, name: this.name, error: error}))
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
        reject(this.error('server_error_no_file', {uuid: this.uuid, type: 'Server', name: 'Server'}))
      } else {
        // load commands and queries handlers
        _.map(files, (filepath) => {
          let handler = require(filepath)
          if (typeof handler === 'function') {
            let name = _.upperFirst(_.camelCase(path.basename(filepath, '.js')))
            let type = 'None'
            if (name.indexOf('Command') !== -1) { type = 'Command' }
            if (name.indexOf('Query') !== -1) { type = 'Query' }
            if (type !== 'None') {
              debug('service %s handler %s is added', type, name)
              if (type === 'Command') { this.services[name] = new Command(name, handler) }
              if (type === 'Query') { this.services[name] = new Query(name, handler) }
              this.services[name].server = this
              // receivers
              let receiver = new Rabbus.Receiver(this.rabbot, name)
              receiver.receive((message, properties, actions, next) => {
                debug('%s with params=%o', properties.type, message)
                actions.ack()
                this.execute(properties.type, message)
              })
              this.receivers[name] = receiver
              // publishers
              let publisher = new Rabbus.Publisher(this.rabbot, this.services[name].EventSuccess)
              this.publishers[this.services[name].EventSuccess] = publisher
              publisher = new Rabbus.Publisher(this.rabbot, this.services[name].EventError)
              this.publishers[this.services[name].EventError] = publisher
            } else {
              debug('service %s handler %s is not added', type, name)
            }
          } else {
            debug('handler service not a function')
          }
        })
      }
      debug('server is ready options=%o', this.options)
      resolve()
    })
  }
  execute (name, params) {
    return new Promise((resolve, reject) => {
      let serviceName = name.split('__')[0]
      serviceName = _.camelCase(serviceName)
      serviceName = _.upperFirst(serviceName)
      const service = this.services[serviceName]
      service.execute(params)
        .then((result) => {
          debug('%s on result=%o', name, result)
          this.publishers[service.EventSuccess].publish(result)
          resolve(result)
        })
        .catch((error) => {
          debug('%s on error=%o', name, error)
          this.publishers[service.EventError].publish(error)
          reject(error)
        })
    })
  }
}

module.exports = Server
