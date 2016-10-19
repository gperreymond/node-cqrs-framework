'use strict'

const debug = require('debug')('cqrs:process')

process.once('SIGINT', () => {
  debug('process on SIGINT')
  process.exit(0)
})

process.on('unhandledRejection', (reason, p) => {
  debug('Unhandled Rejection at: Promise %s reason: %o', p, reason)
})
