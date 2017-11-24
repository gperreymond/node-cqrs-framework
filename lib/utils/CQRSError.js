const eraro = require('eraro')

class Error {
  constructor () {
    this.eraro = eraro({
      package: 'cqrs-framework',
      override: true
    })
  }
  log (message, params) {
    return this.eraro(message, params)
  }
}

module.exports = Error
