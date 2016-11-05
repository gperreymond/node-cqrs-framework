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
  execute (params) {
    const starttime = Date.now()
    return new Promise((resolve, reject) => {
      this.handler(params)
        .then((result) => {
          const exectime = Date.now() - starttime
          let p = {
            type: this.type + '.Success',
            name: this.name,
            params,
            exectime
          }
          if (this.type === 'Query') { p.result = result }
          resolve(p)
        })
        .catch((error) => {
          reject(this.error('service_error', {type: this.type + '.Error', name: this.name, error: error}))
        })
    })
  }
}

module.exports = Service
