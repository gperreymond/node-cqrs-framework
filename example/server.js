'use strict'

const path = require('path')
const Server = require('../').Server

const server = new Server({
  source: path.resolve(__dirname, 'application'),
  patterns: [
    '**/commands/*.js',
    '**/queries/*.js'
  ]
})

console.log('server on initialize')
server.initialize()
  .then(() => {
    console.log('server has initialized')
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
