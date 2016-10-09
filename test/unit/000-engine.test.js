/* global describe:false, it:false */
'use strict'

const Engine = require('../..').Engine

const chai = require('chai')
const expect = chai.expect

describe('[unit] class engine', function () {
  it('should initialize engine without options', function (done) {
    let engine = new Engine()
    engine.initialize()
    done()
  })
  it('should not initialize Engine because no files are found', function (done) {
    try {
      let engine = new Engine({
        source: 'no_files_here_to_initialize'
      })
      engine.initialize()
    } catch (error) {
      expect(error).to.be.an('error')
      expect(error).to.have.property('eraro')
      expect(error).to.have.property('cqrs-framework')
      expect(error).to.have.property('details')
      expect(error.eraro).to.be.equal(true)
      expect(error['cqrs-framework']).to.be.equal(true)
      expect(error.details).to.be.an('object')
      done()
    }
  })
})
