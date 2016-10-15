'use strict'

const nconf = require('nconf')
nconf.env().argv()
nconf.file('global', './example/lib/configuration.json')

module.exports = nconf
