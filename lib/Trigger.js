'use strict'

const Promise = require('bluebird')
const Eraro = require('eraro')
var Errors = require('./helpers/errors')

const uuid = require('uuid')

class Trigger {
  constructor (handler) {
    this.uuid = uuid.v4()
    this.error = Eraro({
      package: 'cqrs-framework',
      msgmap: Errors,
      override: true
    })
  }
  execute (args) {
    return new Promise((resolve, reject) => {
      this.handler(args).then(resolve).catch((error) => {
        reject(this.error('trigger_error', {uuid: this.uuid, type: this.type, name: this.name, error: error}))
      })
    })
  }
}

module.exports = Trigger
