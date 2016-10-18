'use strict'

const debug = require('debug')('cqrs:client')

const Promise = require('bluebird')
const rabbot = require('rabbot')
const Hoek = require('hoek')
const Eraro = require('eraro')
const Errors = require('./helpers/errors')

const uuid = require('uuid')

let internals = {}

internals.options = {
  connection: {
    host: 'localhost',
    port: 5672,
    timeout: 2000,
    heartbeat: 10
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
  exit () {
    return new Promise((resolve) => {
      debug('engine exit and stop all rabbitmq references')
      this.rabbot.closeAll()
        .then(() => {
          debug('rabbot.closeAll() succeed')
          setTimeout(() => {
            resolve()
          }, 250)
        })
        .catch((error) => {
          debug('rabbot.closeAll() failed %o', error)
          setTimeout(() => {
            resolve()
          }, 250)
        })
    })
  }
  initialize () {
    return new Promise((resolve, reject) => {
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
          reject(this.error('client_error_no_bus_connected', {uuid: this.uuid, type: this.type, name: this.name, error: error}))
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
