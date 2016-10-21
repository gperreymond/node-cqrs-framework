'use strict'

const Client = require('../').Client
const client = new Client()

const handlerSuccess = function () {
  // 1) client subscribe to the events
  client.subscribe('BasicNopeQuery.Success')
  client.subscribe('BasicNopeQuery.Error')
  // 2) client.trigger will handler when a event is capture
  client.trigger.on('BasicNopeQuery.Success', handlerBasicNopeQuerySuccess)
  client.trigger.on('BasicNopeQuery.Error', handlerBasicNopeQueryError)
}

const handlerBasicNopeQuerySuccess = function (result) {
  console.log(result)
}

const handlerBasicNopeQueryError = function (result) {
  console.log(result)
}

const handlerError = function (error) {
  console.log(error)
  process.exit(1)
}

client.initialize().then(handlerSuccess).catch(handlerError)
