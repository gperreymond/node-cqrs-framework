'use strict'

const rethink = require('rethinkdbdash')
const Service = require('feathers-rethinkdb')

const config = require('./config')

const r = rethink({
  host: config.get('CQRS_RETHINKDB_HOST'),
  port: config.get('CQRS_RETHINKDB_PORT'),
  db: config.get('CQRS_RETHINKDB_DB'),
  user: config.get('CQRS_RETHINKDB_USER'),
  password: config.get('CQRS_RETHINKDB_PASSWORD'),
  authKey: config.get('CQRS_RETHINKDB_AUTH_KEY'),
  discovery: false,
  silent: true
})

const service = function (table) {
  return new Service({
    Model: r,
    name: table,
    paginate: {
      default: 10,
      max: 50
    }
  })
}

module.exports.r = r
module.exports.service = service
