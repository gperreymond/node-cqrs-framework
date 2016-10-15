'use strict'

const Promise = require('bluebird')
const rethinkdb = require('./../../../../lib/rethinkdb')

const handler = function (id, params = {}) {
  return new Promise((resolve, reject) => {
    rethinkdb.service('individuals').get(id, params).then(resolve).catch(reject)
  })
}

module.exports = handler
