'use strict'

const _ = require('lodash')

const Service = require('./Service')

class Query extends Service {
  constructor (name, handler) {
    super()
    this.type = 'Query'
    this.name = name
    this.EventSuccess = _.snakeCase(name + 'EventSuccess').toUpperCase()
    this.EventError = _.snakeCase(name + 'EventError').toUpperCase()
    this.handler = handler
  }
  execute (args) {
    return super.execute(args)
  }
}

module.exports = Query
