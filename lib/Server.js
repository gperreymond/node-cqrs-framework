const debug = require('debug')('cqrs:server')
const path = require('path')
const glob = require('glob-promise')
const _ = require('lodash')

class Server {
  constructor (options) {
    this.options = options || {}
    this.__handlers = this.__getHandlers
    debug('this.__handlers %o', this.__handlers)
  }
  __getHandlers () {
    debug('__getHandlers')
    let handlers = []
    _.map(this.options.patterns, async (pattern) => {
      let patternPath = path.resolve(this.options.source, pattern)
      handlers = _.union(handlers, await glob(patternPath, {mark: true}))
    })
    return handlers
  }
}

module.exports = Server
