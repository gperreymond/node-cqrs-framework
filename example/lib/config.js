'use strict'

const nconf = require('nconf')
nconf.env().argv()

nconf.file('rethinkdb', './example/rethinkdb.cqrs.json')
nconf.file('rabbitmq', './example/rabbitmq.cqrs.json')
nconf.file('global', './example/nconf.json')

module.exports = nconf
