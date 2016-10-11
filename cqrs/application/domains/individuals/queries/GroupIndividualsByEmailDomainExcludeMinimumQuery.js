'use strict'

const Promise = require('bluebird')
const r = require('./../../../../lib/rethinkdb').r

const handler = function (params) {
  return new Promise((resolve, reject) => {
    r.table('individuals')
      .merge(function (item) {
        return {
          domainName: r.expr(item('email')).split('@').nth(1)
        }
      })
      .group('domainName')
      .count()
      .ungroup()
      .map(function (item) {
        return {
          domain: item('group'),
          count: item('reduction')
        }
      })
      .filter(r.row('count').gt(10))
      .orderBy(r.desc('count'))
      .then((result) => {
        resolve({
          total: result.length,
          data: result
        })
      })
      .catch(reject)
  })
}

module.exports = handler
