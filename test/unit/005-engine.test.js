/* global describe:false, it:false */
'use strict'

const Engine = require('../..').Engine
const Command = require('../..').Command

const chai = require('chai')
const expect = chai.expect

const handlerMockReject = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('This an error in the unit tests'))
  })
}

const handlerMockPublisher = function () {}

describe.only('[unit] class engine', function () {
  it('should not initialize without rabbitmq', function (done) {
    const engine = new Engine({
      connection: {
        port: 5680
      }
    })
    engine.initialize()
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('cqrs-framework')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('engine_error_no_bus_connected')
        expect(error['cqrs-framework']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        engine.exit().then(done)
      })
  })
  it('should not initialize without options', function (done) {
    const engine = new Engine()
    engine.initialize()
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('cqrs-framework')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('engine_error_no_file')
        expect(error['cqrs-framework']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        engine.exit().then(done)
      })
  })
  it('should not initialize because no files are found', function (done) {
    let engine = new Engine({
      source: 'no_files_here_to_initialize'
    })
    engine.initialize()
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('cqrs-framework')
        expect(error).to.have.property('details')
        expect(error.eraro).to.be.equal(true)
        expect(error['cqrs-framework']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        engine.exit().then(done)
      })
  })
  it('should use the execute and be rejected', function (done) {
    const engine = new Engine()
    engine.services = {
      'HandlerMockReject': new Command('HandlerMockReject', handlerMockReject)
    }
    engine.publishers = {
      'HandlerMockReject.Error': {
        publish: handlerMockPublisher
      }
    }
    engine.initialize()
      .catch(() => {
        engine.execute('HandlerMockReject')
          .catch((error) => {
            expect(error).to.be.an('error')
            expect(error).to.have.property('eraro')
            expect(error).to.have.property('cqrs-framework')
            expect(error).to.have.property('details')
            expect(error.eraro).to.be.equal(true)
            expect(error['cqrs-framework']).to.be.equal(true)
            expect(error.details).to.be.an('object')
            engine.exit().then(done)
          })
      })
  })
})
