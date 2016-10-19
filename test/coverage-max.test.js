/* global describe:false, it:false */
'use strict'

require('./../lib/helpers/process')

const path = require('path')

const basedir = path.resolve(__dirname, '..')

describe('[integration] coverage maximum', function () {
  it('should call NotGoodName handler', function (done) {
    require(path.resolve(basedir, 'example/application/NotGoodName'))()
    done()
  })
  it('should call helper/process handlers', function (done) {
    process.emit('unhandledRejection')
    process.emit('SIGINT')
    done()
  })
})
