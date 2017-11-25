const uuid = require('uuid')

const connectors = require('./connectors')

class Client {
  constructor (options = {}) {
    this.uuid = uuid.v4()
    this.options = options
    this.starttime = Date.now()
    this.__bus = require('rabbot')
  }
  async initialize () {
    // initialize connectors to rabbitMQ
    const connectorsResult = await connectors(this)
    if (connectorsResult.eraro === true) return Promise.reject(connectorsResult)
    Promise.resolve()
  }
}

module.exports = Client
