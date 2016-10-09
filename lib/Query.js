'use strict'

const Trigger = require('./Trigger')

class Query extends Trigger {
  constructor (name, handler) {
    super()
    this.type = 'Query'
    this.name = name
    this.handler = handler
  }
  execute (args) {
    return super.execute(args)
  }
}

module.exports = Query
