'use strict'

const _ = require('lodash')
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

function Sender (name) {
  Rabbus.Sender.call(this, rabbot, {
    exchange: _.snakeCase(name).toLowerCase() + '__receiver.exchange',
    routingKey: _.snakeCase(name).toLowerCase() + '__receiver.key'
  })
}
util.inherits(Sender, Rabbus.Sender)

rabbot
  .configure({
    connection: options
  })
  .then(() => {
    for (let i = 0; i < 50; i++) {
      const sender = new Sender('CreateIndividualCommand')
      const message = {
        email: 'world@gmail.com'
      }
      sender.send(message, function () {
        console.log('message has been sent!')
        process.exit(1)
      })
    }
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
