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
  send (name, data) {
    this.debug('publisher %s has been sent with data %o', name, data)
    this.bus.send(name, data)
  }
  start (options) {
    this.debug('listen %s', this.uuid)
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
        this.bus.subscribe({queueName: name, type: 'fanout', exchangeName: 'amq.fanout'}, async (data) => {
          this.debug('subscriber %s has been called with data %o', name, data)
          try {
            await this.__subscribers[name](data)
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
}

util.inherits(Client, EventEmitter)

module.exports = Client
