const Promise = require('bluebird')

const handler = function (params) {
  return new Promise((resolve, reject) => {
    resolve(params)
  })
}

module.exports = handler
