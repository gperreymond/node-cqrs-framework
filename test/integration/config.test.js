/* global describe:false, it:false */
'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

describe('[integration] example/nconf.js', function () {
  it('should get ips from docker network', function (done) {
    const nconf = require(path.resolve(__dirname, '../..', 'example/nconf'))
    console.log(nconf)
    expect(nconf).to.be.an('object')
    done()
  })
})
