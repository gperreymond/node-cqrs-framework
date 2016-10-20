'use strict'

require('./helpers/process')

const debug = require('debug')('cqrs:client')

const Promise = require('bluebird')
const Hoek = require('hoek')
const Eraro = require('eraro')
const Errors = require('./helpers/errors')
const Rabbus = require('./helpers/rabbus')
const EventEmitter = require('events').EventEmitter

const uuid = require('uuid')
const util = require('util')

let internals = {}

internals.options = {
  connection: {
    host: 'localhost',
    port: 5672,
    timeout: 2000,
    heartbeat: 10
  }
}

class Trigger {
  constructor () {
    EventEmitter.call(this)
  }
}
util.inherits(Trigger, EventEmitter)

class Client {
  constructor (options) {
    this.uuid = uuid.v4()
    this.type = 'Client'
    this.options = Hoek.applyToDefaults(internals.options, options || {})
    this.starttime = Date.now()
    this.trigger = new Trigger()
    this.Sender = Rabbus.Sender
    this.Publisher = Rabbus.Publisher
    this.Subscriber = Rabbus.Subscriber
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
        debug('client rabbot unreachable')
        reject(this.error('client_error_no_bus_connected', {uuid: this.uuid, type: this.type, name: this.name, error: new Error('Rabbitmq unreachable')}))
      })
      this.rabbot.on('connected', () => {
        debug('client rabbot started on %s:%s', this.options.connection.host, this.options.connection.port)
        resolve()
      })
      this.rabbot
        .configure({
          connection: this.options.connection
        })
        .catch((error) => {
          debug(this.error('client_rabbot_error', {uuid: this.uuid, type: this.type, name: this.name, error: error}))
        })
    })
  }
  subscribe (event, handler) {
    return new Promise((resolve, reject) => {
      debug('client subscribe to event %s', event)
      const subscriber = new this.Subscriber(this.rabbot, event)
      subscriber.subscribe((message, properties, actions, next) => {
        debug('subscriber.subscribe [%s]', event, actions)
        actions.ack()
        this.trigger.emit(event, message)
      })
    })
  }
  send (service, params) {
    return new Promise((resolve, reject) => {
      debug('client send to service %s with params=%o', service, params)
      const sender = new this.Sender(this.rabbot, service)
      const result = {sended: true}
      sender.send(params, () => {
        const exectime = Date.now() - this.starttime
        resolve({
          uuid: this.uuid,
          type: this.type + '.Send',
          name: service,
          exectime,
          result
        })
      })
    })
  }
}

module.exports = Client
