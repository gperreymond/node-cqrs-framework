'use strict'

// client configuration
const Client = require('../').Client
const client = new Client({
  host: 'localhost',
  port: 5656,
  user: 'admin',
  pass: 'none'
})

// client handlers
const readyHandler = () => {
  client.request('BasicNopeQuery', {debug: true}, (result) => {
    console.log(result)
    process.exit(0)
  })
}
const errorHandler = (error) => {
  console.log(error)
  process.exit(1)
}

// client start sequence
client
  .initialize()
  .then(readyHandler)
  .catch(errorHandler)
