const EventEmitter = require('events').EventEmitter
const util = require('util')

class BusMock {
  constructor (options) {
    if (options.port === 1111) {
      setTimeout(() => {
        this.emit('error', new Error('not connected'))
      }, 200)
    }
    if (options.port === 6666) {
      setTimeout(() => {
        this.emit('ready')
      }, 200)
    }
    EventEmitter.call(this)
  }
}
util.inherits(BusMock, EventEmitter)

class ServicebusMock {
  constructor () {
    EventEmitter.call(this)
  }
  bus (options) {
    return new BusMock(options)
  }
}
util.inherits(ServicebusMock, EventEmitter)

module.exports = ServicebusMock
