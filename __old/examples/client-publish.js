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
const errorCommandHandler = (error) => {
  console.log('errorHandler', error)
}

// client handlers
const readyHandler = () => {
  let count = 1
  setInterval(() => {
    client.publish('BasicNopeCommand', {date: Date.now(), count})
    count++
  }, 2000)
}
const errorHandler = (error) => {
  console.log(error)
  process.exit(1)
}

// client start sequence
client
  .subscribe('BasicNopeCommand.Success', successCommandHandler)
  .subscribe('BasicNopeCommand.Error', errorCommandHandler)
  .initialize()
  .then(readyHandler)
  .catch(errorHandler)
