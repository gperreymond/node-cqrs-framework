'use strict'

const path = require('path')

const Engine = require('./..').Engine
const config = require('./lib/config')

const engine = new Engine({
  bus: {
    url: config.get('CQRS_RABBITMQ_URL')
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
