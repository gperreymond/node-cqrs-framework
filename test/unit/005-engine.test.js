/* global describe:false, it:false */
'use strict'

const Engine = require('../..').Engine
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

describe('[unit] class engine', function () {
  it('should not initialize without options', function (done) {
    let engine = new Engine()
    engine.initialize()
      .then(done)
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
        done()
      })
  })
  it('should not initialize without rabbitmq', function (done) {
    let engine = new Engine({
      bus: {
        url: 'amqp://localhost:6666'
      },
      source: path.resolve(basedir, 'example/application'),
      patterns: ['**/*.js']
    })
    engine.initialize()
      .then(done)
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
        done()
      })
  })
  it('should use the execute and be rejected', function (done) {
    let engine = new Engine()
    engine.services = {
      'handlerMockReject': new Command('handlerMockReject', handlerMockReject)
    }
    engine.bus = {
      publish (name, handler) {
        return null
      }
    }
    engine.execute('handlerMockReject')
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
  it('should not initialize because no files are found', function (done) {
    let engine = new Engine({
      source: 'no_files_here_to_initialize'
    })
    engine.initialize().catch((error) => {
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
