'use strict'

const debug = require('debug')('cqrs:client')

const Promise = require('bluebird')
const Hoek = require('hoek')
const Eraro = require('eraro')
const Errors = require('./helpers/errors')

const uuid = require('uuid')

let internals = {}
internals.options = {
  bus: {
    url: 'amqp://localhost:5672'
  }
}

class Client {
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
      debug('initialize client on %s', this.options.bus.url)
      this.bus = require('servicebus').bus({url: this.options.bus.url})
      this.bus.use(this.bus.correlate())
      this.bus.on('error', (error) => {
        return reject(this.error('client_error_no_bus_connected', {uuid: this.uuid, type: this.type, name: this.name, error: error}))
      })
      this.bus.on('ready', () => {
        this.start().then(resolve).catch(reject)
      })
    })
  }
  start () {
    return new Promise((resolve) => {
      resolve()
    })
  }
}

module.exports = Client
