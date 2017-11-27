const debug = require('debug')('cqrs:client')
const uuid = require('uuid')

const EventEmitter = require('events').EventEmitter
const util = require('util')

class Client {
  constructor () {
    this.uuid = uuid.v4()
    this.starttime = Date.now()
    this.servicebus = require('servicebus')
    EventEmitter.call(this)
  }
  subscribe (name, handler) {
    debug('subscriber %o has added', name)
    this.__subscribers[name] = handler
    return this
  }
  publish (name, message) {
    debug('publisher %o has been called', name)
    this.__bus.publish(name, message)
  }
  listen (options) {
    this.options = options || null
    return this
  }
  ready (callback) {
    this.bus = this.servicebus.bus(this.options)
    this.bus.on('error', callback)
    this.bus.on('ready', callback)
  }
  close () {
    this.bus.close()
  }
}
util.inherits(Client, EventEmitter)

module.exports = Client

// const connectors = require('../Utils/Connectors')
// const subscribers = require('./subscribers')
// return new Promise((resolve, reject) => {
  // initialize connectors to rabbitMQ
  // debug('initialize connectors')
  // connectors(this)
    // .then(() => {
      // initialize the subscribers
      // debug('initialize subscribers')
      // const subscribersResult = subscribers(this)
      // if (subscribersResult.eraro === true) return reject(subscribersResult)
      // resolve()
    // }).catch(error => {
      // reject(error)
    // })
// })
