'use strict'

const debug = require('debug')('cqrs:events')

const config = require('./../../lib/config')
const bus = require('servicebus').bus(config.get('CQRS_RABBITMQ_URL'))

bus.subscribe('CREATE_INDIVIDUAL_COMMAND_EVENT_SUCCESS', (event) => {
  debug('CREATE_INDIVIDUAL_COMMAND_EVENT_SUCCESS %o', event)
})
