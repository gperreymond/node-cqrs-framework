'use strict'

const debug = require('debug')('cqrs:engine')

const Promise = require('bluebird')
const Hoek = require('hoek')
const Rabbus = require('rabbus')
const rabbot = require('rabbot')
const Eraro = require('eraro')
const Errors = require('./helpers/errors')

const path = require('path')
const glob = require('glob')
const _ = require('lodash')
const uuid = require('uuid')
const util = require('util')

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

function Publisher (name) {
  Rabbus.Publisher.call(this, rabbot, {
    exchange: name + '.exchange',
    routingKey: name
  })
}
util.inherits(Publisher, Rabbus.Publisher)

function Subscriber (name) {
  Rabbus.Subscriber.call(this, rabbot, {
    exchange: name + '.exchange',
    queue: name + '.queue',
    routingKey: name
  })
}
util.inherits(Subscriber, Rabbus.Subscriber)

class Engine {
  constructor (options) {
    this.uuid = uuid.v4()
    this.options = Hoek.applyToDefaults(internals.options, options || {})
    this.starttime = Date.now()
    this.services = {}
    this.subscribers = {}
    this.publishers = {}
    this.error = Eraro({
      package: 'cqrs-framework',
      msgmap: Errors,
      override: true
    })
  }
  exit () {
    return new Promise((resolve, reject) => {
      debug('engine exit and stop all rabbitmq references')
      this.rabbot.closeAll()
        .then(() => {
          debug('rabbot.closeAll() succeed')
          resolve()
        })
        .catch((error) => {
          debug('rabbot.closeAll() failed %o', error)
          reject(error)
        })
    })
  }
  initialize () {
    return new Promise((resolve, reject) => {
      this.options.connection.name = 'cqrs-framework-engine.' + this.uuid
      this.rabbot = rabbot
      this.rabbot
        .configure({
          connection: this.options.connection
        })
        .then(() => {
          debug('rabbot started on %s:%s', this.options.connection.host, this.options.connection.port)
          this.start().then(resolve).catch(reject)
        })
        .catch((error) => {
          reject(this.error('engine_error_no_bus_connected', {uuid: this.uuid, type: this.type, name: this.name, error: error}))
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
          let type = 'None'
          if (name.indexOf('Command') !== -1) { type = 'Command' }
          if (name.indexOf('Query') !== -1) { type = 'Query' }
          if (type !== 'None') {
            debug('service %s handler %s is added', type, name)
            if (type === 'Command') { this.services[name] = new Command(name, handler) }
            if (type === 'Query') { this.services[name] = new Query(name, handler) }
            // subscriber
            let subscriber = new Subscriber(name)
            subscriber.subscribe((message, properties, actions, next) => {
              debug('%s with params=%o', properties.type, message)
              this.execute(properties.type, message)
            })
            this.subscribers[name] = subscriber
            // publishers
            let publisher = new Publisher(this.services[name].EventSuccess)
            this.publishers[this.services[name].EventSuccess] = publisher
            publisher = new Publisher(this.services[name].EventError)
            this.publishers[this.services[name].EventError] = publisher
          } else {
            debug('service %s handler %s is not added', type, name)
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

module.exports = Engine
