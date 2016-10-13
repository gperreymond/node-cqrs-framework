'use strict'

const nconf = require('nconf')
nconf
  .env()
  .argv()
  .file({ file: './example/nconf.js' })

module.exports = nconf
