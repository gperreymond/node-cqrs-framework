/* global describe:false, it:false, beforeEach:false */
'use strict'

const Engine = require('../../../../..').Engine

const path = require('path')
const chai = require('chai')
const expect = chai.expect

let engine

const dockers = require(path.resolve(__dirname, '../../../../..', 'example/dockers'))

describe('[integration] GroupIndividualsByEmailDomainExcludeMinimumQuery', function () {
  beforeEach((done) => {
    dockers.networks('test')
      .then(() => {
        done()
      })
  })
  it('should initialize Engine', function (done) {
    engine = new Engine({
      bus: {
        url: require(path.resolve(__dirname, '../../../../..', 'example/nconf.json')).CQRS_RABBITMQ_URL
      },
      source: path.resolve(__dirname, '../../../../..', 'example/application'),
      patterns: ['**/*.js']
    })
    engine.initialize()
    .then(() => {
      expect(engine).to.be.an('object')
      expect(engine).to.have.property('options')
      expect(engine).to.have.property('starttime')
      expect(engine).to.have.property('uuid')
      expect(engine.options).to.be.an('object')
      expect(engine.uuid).to.be.a('string')
      expect(engine.starttime).to.be.a('number')
      done()
    })
  })
  it('should success', function (done) {
    engine.execute('GroupIndividualsByEmailDomainExcludeMinimumQuery')
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
