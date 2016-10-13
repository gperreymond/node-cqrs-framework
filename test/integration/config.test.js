/* global describe:false, it:false */
'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

describe('[integration] example/nconf.js', function () {
  it('should get ips from docker network and save in nconf.json', function (done) {
    require(path.resolve(__dirname, '../..', 'example/nconf')).save()
      .then((nconf) => {
        expect(nconf).to.be.an('object')
        expect(nconf).to.have.property('CQRS_RETHINKDB_HOST')
        expect(nconf.CQRS_RETHINKDB_HOST).to.not.be.undefined
        done()
      })
  })
})
