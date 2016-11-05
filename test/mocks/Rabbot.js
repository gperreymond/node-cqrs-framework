'use strict'

const Promise = require('bluebird')
const EventEmitter = require('events').EventEmitter

const util = require('util')

class RabbotMock {
  constructor () {
    this.__test = 'RabbotMock.Unit.Test'
    EventEmitter.call(this)
  }
  configure (options) {
    return new Promise((resolve, reject) => {
      if (options.connection.port === 1111) {
        reject(new Error('this is an error'))
      }
      if (options.connection.port === 6666) {
        this.emit('connected')
        resolve()
      }
    })
  }
  addExchange () { }
  addQueue () { }
  bindQueue () { }
  handle () { }
  startSubscription () { }
}
util.inherits(RabbotMock, EventEmitter)

module.exports = RabbotMock
