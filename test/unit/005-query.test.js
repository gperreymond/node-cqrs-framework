'use strict'

const Query = require('../..').Query

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

describe('[unit] class query', function () {
  it('should be instancied', function (done) {
    let query = new Query('TestUnitQuery', handlerMockResolve)
    expect(query).to.be.an('object')
    expect(query).to.have.property('error')
    expect(query).to.have.property('type')
    expect(query).to.have.property('name')
    expect(query).to.have.property('handler')
    expect(query.uuid).to.be.a('string')
    expect(query.error).to.be.a('function')
    expect(query.type).to.be.equal('Query')
    expect(query.name).to.be.a('string')
    expect(query.handler).to.be.a('function')
    expect(query.handler()).to.have.property('then')
    expect(query.handler()).to.have.property('catch')
    done()
  })
  it('should execute the handler with no error', function (done) {
    let query = new Query('TestUnitQuery', handlerMockResolve)
    query.execute()
      .then(function (result) {
        expect(result).to.be.an('object')
        expect(result).to.have.property('type')
        expect(result).to.have.property('name')
        expect(result).to.have.property('exectime')
        expect(result).to.have.property('result')
        expect(result.type).to.be.a('string')
        expect(result.name).to.be.a('string')
        expect(result.exectime).to.be.a('number')
        done()
      })
  })
  it('should execute the handler and return error', function (done) {
    let query = new Query('TestUnitquery', handlerMockReject)
    query.execute()
      .catch(function (error) {
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
