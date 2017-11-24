const debug = require('debug')('cqrs:server')
const uuid = require('uuid')

const __getHandlers = require('./getHandlers')

class Server {
  constructor (options) {
    this.uuid = uuid.v4()
    this.options = options || {}
    // loggers
    this.log = {
      debug,
      error: this.logError
    }
    this.handlers = false
  }
  getHandlers () { __getHandlers(this) }
}

module.exports = Server
