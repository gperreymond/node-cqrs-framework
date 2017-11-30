'use strict'

const debug = require('debug')('cqrs:query:handler')
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
  execute (params = { }) {
    debug('Query-%s-%s is called with params=%o', this.name, this.uuid, params)
    return super.execute(params)
  }
}

module.exports = Query
