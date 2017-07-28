'use strict'

const debug = require('debug')('cqrs:server')

const Promise = require('bluebird')
const Rabbus = require('./helpers/rabbus')
const Client = require('./Client')
const Hoek = require('hoek')
const eraro = require('eraro')
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
    this.plugins = {}
    this.services = {}
    // -------------------
    this.client = {}
    // -------------------
    this._publishers = {}
    // -------------------
    this.receivers = {}
    this.subscribers = {}
    this.responders = {}
    // -------------------
    this.error = eraro({
      package: 'cqrs-framework',
      msgmap: Errors,
      override: true
    })
  }
  initialize () {
    return new Promise((resolve, reject) => {
      debug('server try to initialize is bus with %o', this.options.bus)
      if (this.options.rabbot === true) {
        this.bus = Hoek.clone(require('rabbot'))
      } else {
        this.bus = this.options.rabbot
      }
      this.bus.on('connected', () => {
        debug('server#bus started on %s:%s', this.options.bus.host, this.options.bus.port)
        this.client = new Client({
          rabbot: this.options.rabbot,
          bus: this.bus
        })
        this.client.initialize().then(() => {
          debug('server#client initialized')
        }).catch((error) => {
          debug('server#client failed to initialize %o', error)
          reject(error)
        })
      })
      this.bus.on('closed', () => {
        debug('server#bus closed [%s]', this.uuid)
      })
      // start bus
      this.bus
        .configure({ connection: this.options.bus })
        .then(() => {
          debug('server#bus has been configured')
          return this.start().then(resolve)
        })
        .catch((error) => {
          debug('bus not connected', error.code)
          let errorLabel = 'server_error_no_bus_connected'
          if (error.code) {
            errorLabel = error.code
          }
          reject(this.error(errorLabel, {uuid: this.uuid, type: 'Server', name: 'Server', error: error}))
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
              // -------------------------------
              // publishers
              // -------------------------------
              this._publishers[name + '.Success'] = new Rabbus.Publisher(this.bus, name + 'Success')
              this._publishers[name + '.Error'] = new Rabbus.Publisher(this.bus, name + '.Error')
              // -------------------------------
              // receivers
              // -------------------------------
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
              // -------------------------------
              // subscribers
              // -------------------------------
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
              this.subscribers[name] = subscriber
              // -------------------------------
              // responders
              // -------------------------------
              let responder = new Rabbus.Responder(this.bus, name)
              responder.handle((message, properties, actions, next) => {
                this.execute(name, message)
                  .then((result) => {
                    debug('responder %s succeed %o', name, result)
                    actions.reply(result)
                  })
                  .catch((error) => {
                    debug('responder %s failed %o', name, error)
                    actions.reply(error)
                  })
              })
              this.responders[name] = responder
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
  register (name, handler) {
    this.plugins[name] = handler
    return this
  }
  execute (name, params) {
    return new Promise((resolve, reject) => {
      let serviceName = name.split('__')[0]
      serviceName = _.camelCase(serviceName)
      serviceName = _.upperFirst(serviceName)
      const service = this.services[serviceName]
      service.execute(params)
        .then((result) => {
          this._publishers[serviceName + '.Success'].publish(result, () => {
            debug('publish %s result %o', serviceName + '.Success', result)
          })
          resolve(result)
        })
        .catch((error) => {
          this._publishers[serviceName + '.Error'].publish(error, () => {
            debug('publish %s result %o', serviceName + '.Error', error)
          })
          reject(error)
        })
    })
  }
}

module.exports = Server
