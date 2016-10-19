'use strict'

const path = require('path')

const Server = require('./..').Server
const config = require('./lib/config')

const server = new Server({
  connection: {
    host: config.get('CQRS_RABBITMQ_HOST'),
    port: config.get('CQRS_RABBITMQ_PORT')
  },
  source: path.resolve(__dirname, 'application'),
  patterns: require('./patterns')
})

console.log('server on initialize')
server.initialize()
  .then(() => {
    console.log('engine has initialized')
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
