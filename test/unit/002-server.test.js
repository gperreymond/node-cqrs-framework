'use strict'

const Server = require('../..').Server
const Command = require('../..').Command

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const basedir = path.resolve(__dirname, '../..')

const handlerMockReject = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('This an error in the unit tests'))
  })
}

const handlerMockPublisher = function () {}

describe('[unit] class server', function () {
  it('should load files and create handlers', function (done) {
    const server = new Server({
      source: path.resolve(basedir, 'example/application'),
      patterns: ['**/*.js']
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
    const server = new Server()
    server.services = {
      'HandlerMockReject': new Command('HandlerMockReject', handlerMockReject)
    }
    server.publishers = {
      'HandlerMockReject.Error': {
        publish: handlerMockPublisher
      }
    }
    server.initialize()
      .catch(() => {
        server.execute('HandlerMockReject')
          .catch((error) => {
            expect(error).to.be.an('error')
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
})
