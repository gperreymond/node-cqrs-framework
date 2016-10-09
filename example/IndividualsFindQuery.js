'use strict'

const Promise = require('bluebird')
const Service = require('feathers-rethinkdb')
const rethink = require('rethinkdbdash')

const handler = function (params) {
  return new Promise((resolve, reject) => {
    const r = rethink({
      host: '172.22.0.3',
      port: 28015,
      db: 'test',
      user: 'admin',
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

// module.exports = handler

const Query = require('../').Query
const query = new Query('IndividualsFindQuery', handler)
query
  .execute()
  .then((result) => {
    console.log(result)
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
