/* global describe:false, it:false */
'use strict'

const Command = require('../..').Command

const chai = require('chai')
const expect = chai.expect

const handlerMockResolve = function () {
  return new Promise((resolve, reject) => {
    resolve({debug: true})
  })
}

const handlerMockReject = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('This an error in the unit tests.'))
  })
}

describe('[unit] class command', function () {
  it('should be instancied', function (done) {
    let command = new Command('TestUnitCommand', handlerMockResolve)
    expect(command).to.be.an('object')
    expect(command).to.have.property('uuid')
    expect(command).to.have.property('error')
    expect(command).to.have.property('type')
    expect(command).to.have.property('name')
    expect(command).to.have.property('handler')
    expect(command.uuid).to.be.a('string')
    expect(command.error).to.be.a('function')
    expect(command.type).to.be.equal('Command')
    expect(command.name).to.be.a('string')
    expect(command.handler).to.be.a('function')
    expect(command.handler()).to.have.property('then')
    expect(command.handler()).to.have.property('catch')
    done()
  })
  it('should execute the handler with no error', function (done) {
    let command = new Command('TestUnitCommand', handlerMockResolve)
    command.execute()
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
        done()
      })
  })
  it('should execute the handler and return error', function (done) {
    let command = new Command('TestUnitCommand', handlerMockReject)
    command.execute()
      .catch(function (error) {
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
