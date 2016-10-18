/* global describe:false, it:false */
'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const basedir = path.resolve(__dirname, '../../../../..')

const Engine = require(basedir).Engine
const engine = new Engine({
  source: path.resolve(basedir, 'example/application'),
  patterns: ['**/*.js']
})

describe('[integration] GroupIndividualsByEmailDomainExcludeMinimumQuery', function () {
  it('should initialize Engine', function (done) {
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
  it('should close all Rabbitmq', function (done) {
    engine.exit().then(done)
  })
})
