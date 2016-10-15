'use strict'

const nconf = require('nconf')
nconf.env().argv()
nconf.file('global', './example/nconf.json')

module.exports = nconf
