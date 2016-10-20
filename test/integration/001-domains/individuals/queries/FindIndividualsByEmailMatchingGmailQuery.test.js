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

describe('[integration] FindIndividualsByEmailMatchingGmailQuery', function () {
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
      .catch(done)
  })
  it('should success in array mode', function (done) {
    server.execute('FindIndividualsByEmailMatchingGmailQuery')
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
        expect(result.result).to.be.an('array')
        done()
      })
      .catch(done)
  })
  it('should success in paginate mode (1)', function (done) {
    const options = {
      paginate: {
        default: 5,
        max: 25
      },
      query: {
        $skip: 0,
        $limit: 10,
        $sort: {email: 1}
      }
    }
    server.execute('FindIndividualsByEmailMatchingGmailQuery', options)
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
  it('should success in paginate mode (2)', function (done) {
    const options = {
      paginate: {
        default: 5,
        max: 25
      },
      query: {
        $skip: 1,
        $limit: 10,
        $sort: {email: -1}
      }
    }
    server.execute('FindIndividualsByEmailMatchingGmailQuery', options)
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
