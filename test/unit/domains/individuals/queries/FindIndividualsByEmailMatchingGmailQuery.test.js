/* global describe:false, it:false */
'use strict'

const Engine = require('../../../../..').Engine

const path = require('path')
const chai = require('chai')
const expect = chai.expect

let engine

describe('[unit] FindIndividualsByEmailMatchingGmailQuery', function () {
  it('should initialize Engine', function (done) {
    engine = new Engine({
      source: path.resolve(__dirname, '../../../../..', 'cqrs')
    })
    expect(engine).to.be.an('object')
    expect(engine).to.have.property('options')
    expect(engine).to.have.property('starttime')
    expect(engine).to.have.property('uuid')
    expect(engine.options).to.be.an('object')
    expect(engine.uuid).to.be.a('string')
    expect(engine.starttime).to.be.a('number')
    done()
  })
  it('should success in array mode', function (done) {
    engine.execute('findIndividualsByEmailMatchingGmailQuery')
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
    engine.execute('findIndividualsByEmailMatchingGmailQuery', options)
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
    engine.execute('findIndividualsByEmailMatchingGmailQuery', options)
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
