/* global describe:false, it:false */
'use strict'

const path = require('path')

const basedir = path.resolve(__dirname, '../../..')

const structure = require(path.resolve(basedir, 'example/lib/rethinkdb')).structure
const config = require(path.resolve(basedir, 'example/lib/config'))

describe('[integration] rethinkdb structure', function () {
  it('should be a success', function (done) {
    console.log(config.get('CQRS_RABBITMQ_URL'))
    console.log(config.get('CQRS_RETHINKDB_HOST'))
    structure()
      .then(() => {
        done()
      })
      .catch(done)
  })
})
