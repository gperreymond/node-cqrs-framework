'use strict'

// client configuration
const Client = require('../').Client
const client = new Client({
  host: 'localhost',
  port: 5672,
  user: 'guest',
  pass: 'guest'
})

// client subscribe handlers
const successCommandHandler = (message) => {
  console.log('successHandler', message)
}

// client handlers
const readyHandler = () => {
}
const errorHandler = (error) => {
  console.log(error)
  process.exit(1)
}

// client start sequence
client
  .subscribe('BasicNopeCommand.Success', successCommandHandler)
  .initialize()
  .then(readyHandler)
  .catch(errorHandler)
