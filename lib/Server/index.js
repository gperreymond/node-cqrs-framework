const uuid = require('uuid')

const connectors = require('./connectors')
const handlers = require('./handlers')
const publishers = require('./publishers')

class Server {
  constructor (options = {}) {
    this.uuid = uuid.v4()
    this.options = options
    this.starttime = Date.now()
    this.__bus = require('rabbot')
    this.__handlers = {}
    this.__publishers = {}
  }
  async initialize () {
    // initialize connectors to rabbitMQ
    const connectorsResult = await connectors(this)
    if (connectorsResult.eraro === true) return Promise.reject(connectorsResult)
    // initialize the commands and queries handlers
    const handlersResult = await handlers(this)
    if (handlersResult.eraro === true) return Promise.reject(handlersResult)
    // initialize the publishers
    const publishersResult = await publishers(this)
    if (publishersResult.eraro === true) return Promise.reject(publishersResult)
    Promise.resolve()
  }
}

module.exports = Server
