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

function Publisher (name) {
  Rabbus.Publisher.call(this, rabbot, {
    exchange: name + '.exchange',
    routingKey: name
  })
}
util.inherits(Publisher, Rabbus.Publisher)

rabbot
  .configure({
    connection: options
  })
  .then(() => {
    for (let i = 0; i < 100; i++) {
      const publisher = new Publisher('CreateIndividualCommand')
      const message = {
        email: 'world@gmail.com'
      }
      publisher.publish(message, function () {
        console.log('published a message')
        process.exit(1)
      })
    }
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
