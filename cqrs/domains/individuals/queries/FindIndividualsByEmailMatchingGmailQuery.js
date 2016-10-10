'use strict'

const nconf = require('nconf')
nconf
  .env()
  .argv()
  .file({ file: './cqrs/config.json' })

const Promise = require('bluebird')
const rethink = require('rethinkdbdash')
const filter = require('feathers-query-filters')

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
      silent: true
    })

    const paginate = typeof params.paginate !== 'undefined' ? params.paginate : false

    // Start with finding all, and limit when necessary.
    let q = r.table('individuals').filter(r.row('email').match('@gmail.com$'))
    // Prepare the special query params.
    let { filters, query } = filter(params.query || {}, paginate)

    // Handle $sort
    if (filters.$sort) {
      let fieldName = Object.keys(filters.$sort)[0]
      if (parseInt(filters.$sort[fieldName]) === 1) {
        q = q.orderBy(fieldName)
      } else {
        q = q.orderBy(r.desc(fieldName))
      }
    }

    let countQuery
    // For pagination, count has to run as a separate query, but without limit.
    if (paginate.default) {
      countQuery = q.count().run()
    }

    // Handle $skip AFTER the count query but BEFORE $limit.
    if (filters.$skip) {
      q = q.skip(filters.$skip)
    }
    // Handle $limit AFTER the count query and $skip.
    if (filters.$limit) {
      q = q.limit(filters.$limit)
    }

    q = q.run()

    Promise.all([q, countQuery]).then(([data, total]) => {
      if (paginate.default) {
        return {
          total,
          data,
          limit: filters.$limit,
          skip: filters.$skip || 0
        }
      }
      return data
    }).then(resolve).catch(reject)
  })
}

module.exports = handler

/*
query
  .execute({
    paginate: {
      default: 5,
      max: 25
    },
    query: {
      $skip: 0,
      $limit: 10,
      $sort: {email: 1}
    }
  })
  .then((result) => {
    console.log(result)
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(1)
  })
*/
