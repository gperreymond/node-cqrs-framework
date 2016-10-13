'use strict'

const Promise = require('bluebird')

const fs = require('fs')
const exec = require('child_process').exec

const dockerNetwork = function (container) {
  return new Promise((resolve, reject) => {
    var cmd = `docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${container}`
    exec(cmd, (error, stdout) => {
      if (stdout !== null && error === null) {
        const result = stdout.split('\n')[0]
        resolve(result)
      } else {
        resolve('localhost')
      }
    })
  })
}

let data = {
  CQRS_RETHINKDB_PORT: 28015,
  CQRS_RETHINKDB_DB: 'test',
  CQRS_RETHINKDB_USER: 'admin',
  CQRS_RABBITMQ_URL: 'ampq://' + dockerNetwork('rabbitmq_cqrs')
}

module.exports.save = function () {
  return new Promise((resolve, reject) => {
    dockerNetwork('rethinkdb_cqrs')
      .then((ip) => {
        data.CQRS_RETHINKDB_HOST = ip
        return dockerNetwork('rabbitmq_cqrs')
      })
      .then((ip) => {
        data.CQRS_RABBITMQ_URL = 'ampq://' + ip
        return null
      })
      .then(() => {
        fs.writeFileSync('example/nconf.json', JSON.stringify(data))
        resolve(data)
      })
  })
}
