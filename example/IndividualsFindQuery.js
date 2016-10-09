'use strict'

const nconf = require('nconf')

const Promise = require('bluebird')
const Service = require('feathers-rethinkdb')
const rethink = require('rethinkdbdash')

nconf
  .env()
  .argv()
  .file({ file: './example/config.json' })

console.log(nconf.get('DOCKER_IP_CONTAINER_RETHINKDB'))

const handler = function (params) {
  return new Promise((resolve, reject) => {
    const r = rethink({
      host: nconf.get('DOCKER_IP_CONTAINER_RETHINKDB'),
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
