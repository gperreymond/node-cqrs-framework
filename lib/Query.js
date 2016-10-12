'use strict'

const Service = require('./Service')

class Query extends Service {
  constructor (name, handler) {
    super()
    this.type = 'Query'
    this.name = name
    this.EventSuccess = name + '.Success'
    this.EventError = name + '.Error'
    this.handler = handler
  }
  execute (args) {
    return super.execute(args)
  }
}

module.exports = Query
