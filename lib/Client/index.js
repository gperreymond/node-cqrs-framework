const debug = require('debug')('cqrs:client')
const uuid = require('uuid')

const connectors = require('../Utils/Connectors')

class Client {
  constructor (options = {}) {
    this.uuid = uuid.v4()
    this.options = options
    this.starttime = Date.now()
    this.__bus = options.__bus || require('servicebus')
  }
  initialize () {
    return new Promise((resolve, reject) => {
      // initialize connectors to rabbitMQ
      debug('initialize connectors')
      connectors(this)
        .then(() => {
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  }
}

module.exports = Client
