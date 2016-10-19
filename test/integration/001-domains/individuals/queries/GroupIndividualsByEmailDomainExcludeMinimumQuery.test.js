/* global describe:false, it:false */
'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const basedir = path.resolve(__dirname, '../../../../..')

const Server = require(basedir).Server
const server = new Server({
  source: path.resolve(basedir, 'example/application'),
  patterns: ['**/*.js']
})

describe('[integration] GroupIndividualsByEmailDomainExcludeMinimumQuery', function () {
  it('should initialize Server', function (done) {
    server.initialize()
    .then(() => {
      expect(server).to.be.an('object')
      expect(server).to.have.property('options')
      expect(server).to.have.property('starttime')
      expect(server).to.have.property('uuid')
      expect(server.options).to.be.an('object')
      expect(server.uuid).to.be.a('string')
      expect(server.starttime).to.be.a('number')
      done()
    })
  })
  it('should success', function (done) {
    server.execute('GroupIndividualsByEmailDomainExcludeMinimumQuery')
      .then(function (result) {
        expect(result).to.be.an('object')
        expect(result).to.have.property('uuid')
        expect(result).to.have.property('type')
        expect(result).to.have.property('name')
        expect(result).to.have.property('exectime')
        expect(result).to.have.property('result')
        expect(result.uuid).to.be.a('string')
        expect(result.type).to.be.a('string')
        expect(result.name).to.be.a('string')
        expect(result.exectime).to.be.a('number')
        expect(result.result).to.be.an('object')
        expect(result.result).to.have.property('total')
        expect(result.result.total).to.be.a('number')
        done()
      })
      .catch(done)
  })
})
