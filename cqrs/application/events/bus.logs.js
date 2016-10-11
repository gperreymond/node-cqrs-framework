'use strict'

const config = require('./../../lib/config')
const bus = require('servicebus').bus(config.get('CQRS_RABBITMQ_URL'))

bus.subscribe('CREATE_INDIVIDUAL_COMMAND_EVENT_SUCCESS', (event) => {
  console.log('CREATE_INDIVIDUAL_COMMAND_EVENT_SUCCESS', event)
})
