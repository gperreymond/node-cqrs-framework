'use strict'

const nconf = require('nconf')
nconf
  .env()
  .argv()
  .file({ file: './cqrs/config.json' })

const Promise = require('bluebird')
const Service = require('feathers-rethinkdb')
const rethink = require('rethinkdbdash')

const handler = function (params = {}) {
  return new Promise((resolve, reject) => {
    const r = rethink({
      host: nconf.get('CQRS_RETHINKDB_HOST'),
      port: nconf.get('CQRS_RETHINKDB_PORT'),
      db: nconf.get('CQRS_RETHINKDB_DB'),
      user: nconf.get('CQRS_RETHINKDB_USER'),
      password: nconf.get('CQRS_RETHINKDB_PASSWORD'),
      authKey: nconf.get('CQRS_RETHINKDB_AUTH_KEY'),
      discovery: false,
      silent: false
    })
    const service = new Service({
      Model: r,
      name: 'individuals',
      paginate: {
        default: 10,
        max: 50
      }
    })
    service.create(params).then(resolve).catch(reject)
  })
}

module.exports = handler
