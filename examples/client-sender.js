'use strict'

// client configuration
const Client = require('../').Client
const client = new Client({
  host: 'localhost',
  port: 5656,
  user: 'user',
  pass: 'password'
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
    client.send('BasicNopeCommand', {date: Date.now(), count}, (acknowledgement) => {
      console.log('acknowledgement', acknowledgement)
      count++
    })
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
