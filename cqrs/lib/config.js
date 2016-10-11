'use strict'

const nconf = require('nconf')
nconf
  .env()
  .argv()
  .file({ file: './cqrs/config.json' })

module.exports = nconf
