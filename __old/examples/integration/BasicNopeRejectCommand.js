'use strict'

const Promise = require('bluebird')

const handler = function (params) {
  return new Promise((resolve, reject) => {
    reject(new Error('this is an error!'))
  })
}

module.exports = handler
