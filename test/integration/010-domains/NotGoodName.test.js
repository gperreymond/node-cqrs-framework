/* global describe:false, it:false */
'use strict'

const path = require('path')

const basedir = path.resolve(__dirname, '../../..')

describe('[integration] coverage maximum', function () {
  it('should call NotGoodName handler', function (done) {
    require(path.resolve(basedir, 'example/application/NotGoodName'))()
    done()
  })
})
