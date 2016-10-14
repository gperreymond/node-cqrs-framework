'use strict'

const nconf = require('nconf')
nconf.env().argv()

nconf.file('global', './example/nconf.json')
nconf.file('rethinkdb', './example/.rethinkdb.cqrs.env')
nconf.file('rabbitmq', './example/.rabbitmq.cqrs.env')

module.exports = nconf
