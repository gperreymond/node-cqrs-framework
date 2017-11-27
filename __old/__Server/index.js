const debug = require('debug')('cqrs:server')
const uuid = require('uuid')

const connectors = require('../Utils/Connectors')
const handlers = require('./handlers')
const subscribers = require('./subscribers')

class Server {
  constructor (options = {}) {
    debug('constructor')
    this.uuid = uuid.v4()
    this.options = options
    this.starttime = Date.now()
    this.__bus = options.__bus || require('servicebus')
    this.__handlers = {}
    this.__subscribers = {}
  }
  initialize () {
    return new Promise((resolve, reject) => {
      // initialize the commands and queries handlers
      debug('initialize handlers')
      const handlersResult = handlers(this)
      if (handlersResult.eraro === true) return reject(handlersResult)
      // initialize connectors to rabbitMQ
      debug('initialize connectors')
      connectors(this)
        .then(() => {
          // initialize the subscribers
          debug('initialize subscribers')
          const subscribersResult = subscribers(this)
          if (subscribersResult.eraro === true) return reject(subscribersResult)
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  }
  publish (name, message) {
    debug('publisher %o has been called', name)
    this.__bus.publish(name, message)
  }
}

module.exports = Server
