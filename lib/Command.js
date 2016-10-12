'use strict'

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
    return super.execute(args)
  }
}

module.exports = Command
