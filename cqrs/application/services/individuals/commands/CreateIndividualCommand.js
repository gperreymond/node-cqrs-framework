'use strict'

const Promise = require('bluebird')
const Joi = require('joi')

const rethinkdb = require('./../../../../lib/rethinkdb')
const schema = require('./../../../../schema/individual')

const handler = function (params = {}) {
  return new Promise((resolve, reject) => {
    Joi.validate(params, schema.before, (error) => {
      if (error) { return reject(error) }
      rethinkdb.service('individuals').create(params).then(resolve).catch(reject)
    })
  })
}

module.exports = handler
