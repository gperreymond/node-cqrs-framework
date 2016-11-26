'use strict'

const debug = require('debug')('cqrs:server')

const Promise = require('bluebird')
const Rabbus = require('./helpers/rabbus')
const Hoek = require('hoek')
const Eraro = require('eraro')
const Errors = require('./helpers/errors')

// const amqp = require('amqp')
const path = require('path')
const glob = require('glob')
const _ = require('lodash')
const uuid = require('uuid')

const Command = require('./Command')
const Query = require('./Query')

let internals = {}

internals.options = {
  rabbot: true,
  bus: {
    host: 'localhost',
    port: 5672,
    user: 'guest',
    pass: 'guest',
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
    this.subscribers = {}
    this.error = Eraro({
      package: 'cqrs-framework',
      msgmap: Errors,
      override: true
    })
  }
  initialize () {
    return new Promise((resolve, reject) => {
      debug('server try to initialize the bus %o', this.options.bus)
      if (this.options.rabbot === true) {
        this.bus = Hoek.clone(require('rabbot'))
      } else {
        this.bus = this.options.rabbot
      }
      this.bus.on('connected', () => {
        debug('bus started on %s:%s', this.options.bus.host, this.options.bus.port)
        this.start().then(resolve).catch(reject)
      })
      this.bus
        .configure({ connection: this.options.bus })
        .catch((error) => {
          debug('bus not connected')
          reject(this.error('server_error_no_bus_connected', {uuid: this.uuid, type: 'Server', name: 'Server', error: error}))
        })
    })
  }
  start () {
    return new Promise((resolve, reject) => {
      debug('server try to discover services')
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
              let receiver = new Rabbus.Receiver(this.bus, name)
              receiver.receive((message, properties, actions, next) => {
                actions.ack()
                this.execute(properties.type, message)
                  .then((result) => {
                    debug('receiver succeed %o', result)
                  })
                  .catch((error) => {
                    debug('receiver failed %o', error)
                  })
              })
              this.receivers[name] = receiver
              // subscribers
              let subscriber = new Rabbus.Subscriber(this.bus, name)
              subscriber.subscribe((message, properties, actions, next) => {
                actions.ack()
                this.execute(name, message)
                  .then((result) => {
                    debug('subscriber succeed %o', result)
                  })
                  .catch((error) => {
                    debug('subscriber failed %o', error)
                  })
              })
              this.publishers[name] = subscriber
              // publishers
              let publisher = new Rabbus.Publisher(this.bus, this.services[name].EventSuccess)
              this.publishers[this.services[name].EventSuccess] = publisher
              publisher = new Rabbus.Publisher(this.bus, this.services[name].EventError)
              this.publishers[this.services[name].EventError] = publisher
              // responders
              let responder = new Rabbus.Responder(this.bus, name)
              responder.handle((message, properties, actions, next) => {
                this.execute(name, message)
                  .then((result) => {
                    debug('responder succeed %o', result)
                    actions.reply(result)
                  })
                  .catch((error) => {
                    debug('responder failed %o', error)
                    actions.reply(error)
                  })
              })
            } else {
              debug('service %s handler %s is not added', type, name)
            }
          } else {
            debug('handler service not a function')
          }
        })
        resolve()
      }
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
          this.publishers[service.EventSuccess].publish(result, () => {
            debug('publish %s result %o', service.EventSuccess, result)
          })
          resolve(result)
        })
        .catch((error) => {
          this.publishers[service.EventError].publish(error, () => {
            debug('publish %s result %o', service.EventError, error)
          })
          reject(error)
        })
    })
  }
}

module.exports = Server
