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
  async initialize () {
    // initialize connectors to rabbitMQ
    debug('initialize connectors')
    const connectorsResult = await connectors(this)
    if (connectorsResult.eraro === true) return Promise.reject(connectorsResult)
    Promise.resolve()
  }
}

module.exports = Client
