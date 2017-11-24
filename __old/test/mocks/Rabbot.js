'use strict'

const debug = require('debug')('cqrs:mock:rabbot')
const Promise = require('bluebird')
const EventEmitter = require('events').EventEmitter
const util = require('util')

class RabbotMock {
  constructor () {
    debug('constructor')
    this.__test = 'RabbotMock.Unit.Test'
    this.__connected = false
    EventEmitter.call(this)
  }
  configure (options) {
    debug('configure # connected is %s', this.__connected)
    return new Promise((resolve, reject) => {
      if (this.__connected === true) {
        return resolve()
      }
      if (options.connection.port === 1111) {
        debug('reject because port is 1111')
        return reject(new Error('this is an error'))
      }
      if (options.connection.port === 6666) {
        debug('emit connected because port is 6666')
        this.__connected = true
        this.emit('connected')
        return resolve()
      }
      reject(new Error('huston, we have a problem!'))
    })
  }
  publish () { }
  addExchange () { }
  addQueue () { }
  bindQueue () { }
  handle () { }
  startSubscription () { }
}
util.inherits(RabbotMock, EventEmitter)

module.exports = RabbotMock
