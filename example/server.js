'use strict'

const path = require('path')
const Server = require('node-cqrs-framework').Server

const server = new Server({
  source: path.resolve(__dirname, 'application'),
  patterns: [
    'domains/**/commands/*.js',
    'domains/**/queries/*.js'
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
