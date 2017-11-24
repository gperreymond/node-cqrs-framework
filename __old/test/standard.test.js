'use strict'

const standard = require('mocha-standard')

describe('code style', function () {
  it('should be conforms to standard', standard.files([
    'index.js',
    'test/**/*.js',
    'lib/**/*.js',
    'examples/**/*.js'
  ]))
})
