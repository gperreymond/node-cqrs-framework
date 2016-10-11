'use strict'

const _ = require('lodash')

const Service = require('./Service')

class Command extends Service {
  constructor (name, handler) {
    super()
    this.type = 'Command'
    this.name = name
    this.EventSuccess = _.snakeCase(name + 'EventSuccess').toUpperCase()
    this.EventError = _.snakeCase(name + 'EventError').toUpperCase()
    this.handler = handler
  }
  execute (args) {
    return super.execute(args)
  }
}

module.exports = Command
