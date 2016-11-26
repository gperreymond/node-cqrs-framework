'use strict'

const path = require('path')

// server configuration
const Server = require('../').Server
const server = new Server({
  bus: {
    host: 'localhost',
    port: 5656,
    user: 'admin',
    pass: 'none'
  },
  source: path.resolve(__dirname),
  patterns: [
    'commands/**/*.js',
    'queries/**/*.js'
  ]
})

// server handlers
const readyHandler = () => {
}
const errorHandler = (error) => {
  console.log(error)
  process.exit(1)
}

server
  .initialize()
  .then(readyHandler)
  .catch(errorHandler)
