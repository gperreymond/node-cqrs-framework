const uuid = require('uuid')
const Hoek = require('hoek')
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
    this.__headers = {
      'x-client-id': 'Client.Response.' + this.uuid
    }
    this.__requesters = {}
    this.__subscribers = {}
    EventEmitter.call(this)
  }
  // subscribe to events error and/or success
  subscribe (name, handler) {
    this.debug('subscriber %s has been added', name)
    this.__subscribers[name] = handler
    return this
  }
  // fire & forget
  send (name, data) {
    this.debug('publisher %s has been sent with data %o', name, data)
    this.bus.send(name, data)
  }
  // request & response
  request (name, data, callback) {
    this.debug('requester %s has been sent with data %o', name, data)
    data.__headers = Hoek.clone(Object.assign(this.__headers, {'x-request-id': uuid.v4()}))
    this.__requesters[data.__headers['x-request-id']] = callback
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
      // the response channel
      this.bus.listen(this.__headers['x-client-id'], data => {
        this.debug('responser has been called with data %o', data)
        const callback = Hoek.clone(this.__requesters[data.params.__headers['x-request-id']])
        delete this.__requesters[data.params.__headers['x-request-id']]
        delete data.params.__headers
        callback(data)
      })
      // all events subscribers
      const subscribers = Object.keys(this.__subscribers)
      subscribers.map(name => {
        this.bus.subscribe({
          routingKey: name,
          queueName: name + '.' + this.uuid
        }, async (data) => {
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
