const uuid = require('uuid')
const EventEmitter = require('events').EventEmitter
const util = require('util')

const CQRSError = require('./Utils/CQRSError')
const cqrsError = new CQRSError()

class Client {
  constructor (bus) {
    this.debug = require('debug')('cqrs:client')
    this.uuid = uuid.v4()
    this.starttime = Date.now()
    this.servicebus = bus || require('servicebus')
    this.__subscribers = {}
    EventEmitter.call(this)
  }
  subscribe (name, handler) {
    this.debug('subscriber %s has been added', name)
    this.__subscribers[name] = handler
    return this
  }
  listen (options) {
    this.debug('listen')
    this.options = this.options = Object.assign({
      host: 'localhost',
      port: 5672,
      user: 'guest',
      pass: 'guest',
      timeout: 2000,
      heartbeat: 10
    }, options)
    this.bus = this.servicebus.bus(this.options)
    this.bus.on('error', error => {
      this.emit('error', cqrsError.log('internal_error', {uuid: this.uuid, type: 'Client', name: 'Client', error}))
    })
    this.bus.on('ready', () => {
      const subscribers = Object.keys(this.__subscribers)
      subscribers.map(name => {
        this.bus.subscribe(name, async (params) => {
          this.debug('execute subscriber %s with params %o', name, params)
          try {
            await this.__subscribers[name](params)
          } catch (e) {
            this.bus.emit('error', e)
          }
        })
      })
      this.emit('ready')
    })
  }
  close () {
    this.bus.close()
  }
  publish (name, message) {
    this.debug('publisher %s has been called', name)
    this.bus.publish(name, message)
  }
}
util.inherits(Client, EventEmitter)

module.exports = Client
