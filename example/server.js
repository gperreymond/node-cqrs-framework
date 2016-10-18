'use strict'

const path = require('path')

const Engine = require('./..').Engine
const config = require('./lib/config')

process.once('SIGINT', () => {
  console.log('process > SIGINT')
  engine.exit()
  process.exit(0)
})
process.on('unhandledException', (error) => {
  console.log('process > unhandledException')
  console.log(error)
  engine.exit()
  process.exit(1)
})

const engine = new Engine({
  connection: {
    host: config.get('CQRS_RABBITMQ_HOST'),
    port: config.get('CQRS_RABBITMQ_PORT')
  },
  source: path.resolve(__dirname, 'application'),
  patterns: require('./patterns')
})

console.log('engine on initialize')
engine.initialize()
  .then(() => {
    console.log('engine has initialized')
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
