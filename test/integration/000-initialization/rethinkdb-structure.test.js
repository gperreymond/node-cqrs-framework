/* global describe:false, it:false */
'use strict'

const path = require('path')

const basedir = path.resolve(__dirname, '../../..')

const structure = require(path.resolve(basedir, 'example/lib/rethinkdb')).structure

describe('[integration] rethinkdb structure', function () {
  it('should be a success', function (done) {
    structure()
      .then(() => {
        done()
      })
      .catch(done)
  })
})
