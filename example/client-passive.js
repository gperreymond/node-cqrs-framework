'use strict'

const util = require('util')
const Rabbus = require('rabbus')
const rabbot = require('rabbot')

const options = {
  connection: {
    host: 'localhost',
    port: 5672,
    timeout: 2000,
    heartbeat: 10
  }
}

function Subscriber (name) {
  Rabbus.Subscriber.call(this, rabbot, {
    exchange: name + '.exchange',
    queue: name + '.queue',
    routingKey: name
  })
}
util.inherits(Subscriber, Rabbus.Subscriber)

rabbot
  .configure({
    connection: options
  })
  .then(() => {
    let subscriber = new Subscriber('CreateIndividualCommand.Success')
    subscriber.subscribe(function (message, properties, actions, next) {
      console.log(message)
      actions.ack()
    })
    subscriber = new Subscriber('CreateIndividualCommand.Error')
    subscriber.subscribe(function (message, properties, actions, next) {
      console.log(message)
      actions.ack()
    })
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
