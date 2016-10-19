'use strict'

const Client = require('../').Client
const config = require('./lib/config')

let current = 1

const test = function (current) {
  const client = new Client({
    connection: {
      host: config.get('CQRS_RABBITMQ_HOST'),
      port: config.get('CQRS_RABBITMQ_PORT')
    }
  })

  const message = {
    email: 'world@gmail.com'
  }
  client.send('CreateIndividualCommand', message)
    .then((result) => {
      current -= 1
      if (current === 0) {
        console.log('all done')
        process.exit(0)
      } else {
        test(current)
      }
    })
    .catch((error) => {
      console.log(error)
      process.exit(1)
    })
}

test(current)
