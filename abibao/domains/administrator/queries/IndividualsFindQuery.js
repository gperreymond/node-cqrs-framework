'use strict'

const nconf = require('nconf')
nconf
  .env()
  .argv()
  .file({ file: './abibao/config.json' })

const Promise = require('bluebird')
const Service = require('feathers-rethinkdb')
const rethink = require('rethinkdbdash')

const handler = function (params = {}) {
  return new Promise((resolve, reject) => {
    const r = rethink({
      host: nconf.get('DATABASE_RETHINKDB_HOST'),
      port: nconf.get('DATABASE_RETHINKDB_PORT'),
      db: nconf.get('DATABASE_RETHINKDB_DB'),
      user: nconf.get('DATABASE_RETHINKDB_USER'),
      password: nconf.get('DATABASE_RETHINKDB_PASSWORD'),
      authKey: nconf.get('DATABASE_RETHINKDB_AUTH_KEY'),
      discovery: false,
      silent: true
    })
    const service = new Service({
      Model: r,
      name: 'individuals',
      paginate: {
        default: 10,
        max: 50
      }
    })
    service.find(params).then(resolve).catch(reject)
  })
}

module.exports = handler
