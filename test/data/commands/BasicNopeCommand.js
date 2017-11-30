const Promise = require('bluebird')

const handler = function (params) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      reject(new Error('not good!'))
    }, 1000)
  })
}

module.exports = handler
