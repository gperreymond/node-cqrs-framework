'use strict'

const exec = require('child_process').exec

const dockerNetwork = function (container) {
  var cmd = `docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${container}`
  exec(cmd, (error, stdout, stderr) => {
    if (error !== null) {
      return 'localhost'
    } else {
      const result = stdout.split('\n')[0]
      return result
    }
  })
}

module.exports = {
  CQRS_RETHINKDB_HOST: dockerNetwork('rethinkdb_cqrs'),
  CQRS_RETHINKDB_PORT: 28015,
  CQRS_RETHINKDB_DB: 'test',
  CQRS_RETHINKDB_USER: 'admin',
  CQRS_RABBITMQ_URL: 'ampq://' + dockerNetwork('rabbitmq_cqrs')
}
