'use strict'

const Promise = require('bluebird')
const Eraro = require('eraro')
const Errors = require('./helpers/errors')

const uuid = require('uuid')

class Service {
  constructor () {
    this.uuid = uuid.v4()
    this.error = Eraro({
      package: 'cqrs-framework',
      msgmap: Errors,
      override: true
    })
  }
  execute (args) {
    const starttime = Date.now()
    return new Promise((resolve, reject) => {
      this.handler(args)
        .then((result) => {
          const exectime = Date.now() - starttime
          resolve({
            uuid: this.uuid,
            type: this.type,
            name: this.name,
            exectime,
            result
          })
        })
        .catch((error) => {
          reject(this.error('service_error', {uuid: this.uuid, type: this.type, name: this.name, error: error}))
        })
    })
  }
}

module.exports = Service