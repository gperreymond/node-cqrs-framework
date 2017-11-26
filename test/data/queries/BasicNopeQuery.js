const Promise = require('bluebird')

const handler = function (params) {
  return new Promise((resolve, reject) => {
    setTimeout(function () {
      resolve({data: true})
    }, 1000)
  })
}

module.exports = handler
