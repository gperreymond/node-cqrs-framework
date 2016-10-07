'use strict'

const Trigger = require('./Trigger')

class Command extends Trigger {
  constructor (name, handler) {
    super()
    this.type = 'Command'
    this.name = name
    this.handler = handler
  }
  execute (args) {
    return super.execute(args)
  }
}

module.exports = Command
