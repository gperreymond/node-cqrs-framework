'use strict'

const Promise = require('bluebird')
const Server = require('../..').Server
const Command = require('../..').Command

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const basedir = path.resolve(__dirname, '../..')

const RabbotMock = require('../mocks/Rabbot')
const rabbotMock = new RabbotMock()

const handlerMockReject = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('This an error in the unit tests'))
  })
}

const handlerMockPublisher = function () {}

describe('[unit] class server', function () {
  it('should load files and create handlers', function (done) {
    const server = new Server({
      rabbot: rabbotMock,
      bus: {
        port: 6666
      },
      source: path.resolve(basedir, 'examples'),
      patterns: ['commands/**/*.js', 'queries/**/*.js', 'bads/**/*.js']
    })
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
  it('should use the execute and be rejected', function (done) {
    const server = new Server({
      rabbot: rabbotMock,
      bus: {
        port: 6666
      },
      source: path.resolve(basedir, 'examples'),
      patterns: ['commands/**/*.js', 'queries/**/*.js']
    })
    server.services = {
      'HandlerMockReject': new Command('HandlerMockReject', handlerMockReject)
    }
    server.publishers = {
      'HandlerMockReject.Error': {
        publish: handlerMockPublisher
      }
    }
    server.execute('HandlerMockReject')
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('cqrs-framework')
        expect(error).to.have.property('details')
        expect(error.eraro).to.be.equal(true)
        expect(error['cqrs-framework']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        done()
      })
  })
})
