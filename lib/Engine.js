'use strict'

const uuid = require('uuid')

class Engine {
  constructor () {
    this.uuid = uuid.v4()
    this.starttime = Date.now()
    this.commands = []
    this.queries = []
  }
}

module.exports = Engine
