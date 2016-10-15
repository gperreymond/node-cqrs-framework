'use strict'

const debug = require('debug')('cqrs:command:handler')

const Service = require('./Service')

class Command extends Service {
  constructor (name, handler) {
    super()
    this.type = 'Command'
    this.name = name
    this.EventSuccess = name + '.Success'
    this.EventError = name + '.Error'
    this.handler = handler
  }
  execute (args) {
    debug('Command-%s-%s is called with params=%o', this.name, this.uuid, args)
    return super.execute(args)
  }
}

module.exports = Command
