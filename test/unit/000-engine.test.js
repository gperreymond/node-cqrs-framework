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

describe('[unit] class engine', function () {
  it('should initialize engine without options', function (done) {
    let engine = new Engine()
    engine.initialize().then(done)
  })
  it('should use the execute from engine and be rejected', function (done) {
    let engine = new Engine()
    engine.services = {
      'handlerMockReject': new Command('handlerMockReject', handlerMockReject)
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
  it('should not initialize Engine because no files are found', function (done) {
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
