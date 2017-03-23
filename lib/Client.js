'use strict'

const debug = require('debug')('cqrs:client')

const Promise = require('bluebird')
const Rabbus = require('./helpers/rabbus')
const Hoek = require('hoek')
const Eraro = require('eraro')
const Errors = require('./helpers/errors')

const uuid = require('uuid')
const _ = require('lodash')

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

class Client {
  constructor (options) {
    this.uuid = uuid.v4()
    this.options = Hoek.applyToDefaults(internals.options, options || {})
    this.starttime = Date.now()
    this.handlers = {}
    this.subscribers = {}
    this.error = Eraro({
      package: 'cqrs-framework',
      msgmap: Errors,
      override: true
    })
  }
  initialize () {
    return new Promise((resolve, reject) => {
      if (this.options.rabbot === true) {
        this.bus = Hoek.clone(require('rabbot'))
      } else {
        this.bus = this.options.rabbot
      }
      debug('client try to initialize the bus %o', this.options.bus)
      this.bus.on('connected', () => {
        debug('bus started on %s:%s', this.options.bus.host, this.options.bus.port)
        // subscribers
        _.map(Object.keys(this.subscribers), (event) => {
          const subscriber = new Rabbus.Subscriber(this.bus, event)
          subscriber.subscribe((message, properties, actions, next) => {
            actions.ack()
            debug('subscriber.subscribe %o', message)
            this.handlers[event](message)
          })
          this.subscribers[event] = subscriber
        })
        // end initialize
        resolve()
      })
      this.bus.on('closed', () => {
        debug('bus closed [%s]', this.uuid)
      })
      this.bus
        .configure({ connection: this.options.bus })
        .then(() => {
          debug('bus waiting for connected')
        })
        .catch((error) => {
          debug('bus not connected')
          reject(this.error('client_error_no_bus_connected', {uuid: this.uuid, type: 'Client', name: 'Client', error: error}))
        })
    })
  }
  // passive
  subscribe (event, handler) {
    debug('client.subscribe on event %s', event)
    this.subscribers[event] = event
    this.handlers[event] = handler
    return this
  }
  // active
  publish (service, params) {
    debug('client.publish service %s with params=%o', service, params)
    const publisher = new Rabbus.Publisher(this.bus, service)
    publisher.publish(params, () => {
      debug('publish %s params %o', service, params)
    })
  }
  // active
  send (service, params, acknowledgement) {
    debug('client.send service %s with params=%o', service, params)
    const sender = new Rabbus.Sender(this.bus, service)
    const starttime = Date.now()
    sender.send(params, () => {
      debug('send %s params %o', service, params)
      acknowledgement({
        type: 'Send.Acknowledgement',
        service,
        params,
        exectime: Date.now() - starttime
      })
    })
  }
  // active
  request (service, params, callback) {
    const requester = new Rabbus.Requester(this.bus, service)
    requester.request(params, (response) => {
      debug('request %s params %o', service, params)
      callback(response)
    })
  }
}

module.exports = Client
