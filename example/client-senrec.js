'use strict'

const Client = require('../').Client
const config = require('./lib/config')

process.once('SIGINT', () => {
  console.log('process > SIGINT')
  client.exit()
  process.exit(0)
})
process.on('unhandledException', (error) => {
  console.log('process > unhandledException')
  console.log(error)
  client.exit()
  process.exit(1)
})

const client = new Client({
  connection: {
    host: config.get('CQRS_RABBITMQ_HOST'),
    port: config.get('CQRS_RABBITMQ_PORT')
  }
})

console.log('client on initialize')
client.initialize()
  .then(() => {
    console.log('client has initialized')
    const sender = new client.Sender('CreateIndividualCommand')
    const message = {
      email: 'world@gmail.com'
    }
    sender.send(message, function () {
      console.log('message has been sent!')
      process.exit(1)
    })
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })

/*
rabbot
  .configure({
    connection: options
  })
  .then(() => {
    for (let i = 0; i < 10; i++) {
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
*/
