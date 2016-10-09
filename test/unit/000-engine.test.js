/* global describe:false, it:false */
'use strict'

const Engine = require('../..').Engine

const chai = require('chai')
const expect = chai.expect

describe('[unit] Class Engine', function () {
  it('should create a new class', function (done) {
    let engine = new Engine()
    expect(engine).to.be.an('object')
    expect(engine).to.have.property('uuid')
    expect(engine).to.have.property('starttime')
    expect(engine.uuid).to.be.a('string')
    expect(engine.starttime).to.be.a('number')
    done()
  })
})
