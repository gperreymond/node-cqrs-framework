'use strict'

const Promise = require('bluebird')
const rethinkdb = require('./../../../../lib/rethinkdb')

const handler = function (params = {}) {
  return new Promise((resolve, reject) => {
    rethinkdb.service('individuals').create(params).then(resolve).catch(reject)
  })
}

module.exports = handler
