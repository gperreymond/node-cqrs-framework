'use strict'

const Client = require('../').Client
const client = new Client()

const fs = require('fs')
const path = require('path')
const bunyanLumberjackStream = require('bunyan-lumberjack')

const outStream = bunyanLumberjackStream({
  tlsOptions: {
    host: 'localhost',
    port: 5000,
    ca: [fs.readFileSync(path.resolve(__dirname, 'logstash.crt'), {encoding: 'utf-8'})]
  },
  metadata: {beat: 'lowercase-name', type: 'default'}
})

outStream.on('connect', function () {
  console.log('logstash connected')
  client.initialize().then(handlerSuccess).catch(handlerError)
})
outStream.on('dropped', function (count) {
  console.log('logstash dropped ' + count + ' messages!')
})
outStream.on('disconnect', function (err) {
  console.log('logstash disconnected', err)
})

const logger = require('bunyan').createLogger({
  src: false,
  name: 'node-cqrs-framework',
  level: 'info',
  streams: [{
    level: 'debug',
    stream: process.stdout
  }, {
    level: 'info',
    type: 'raw',
    stream: outStream
  }]
})

const handlerSuccess = function () {
  // 1) client subscribe to the events
  client.subscribe('CreateIndividualCommand.Success')
  client.subscribe('CreateIndividualCommand.Error')
  // 2) client.trigger will handler when a event is capture
  client.trigger.on('CreateIndividualCommand.Success', handlerTriggerSuccessLogs)
  client.trigger.on('CreateIndividualCommand.Error', handlerTriggerErrorLogs)
  logger.debug('client has just started')
}

const handlerTriggerSuccessLogs = function (result) {
  logger.info(result)
}

const handlerTriggerErrorLogs = function (error) {
  logger.error(error)
}

const handlerError = function (error) {
  logger.info(error)
  process.exit(1)
}
