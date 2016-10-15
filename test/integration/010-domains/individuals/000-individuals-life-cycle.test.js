/* global describe:false, it:false */
'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const basedir = path.resolve(__dirname, '../../../..')

const Engine = require(basedir).Engine
const config = require(path.resolve(basedir, 'example/lib/config'))

let engine
let data
var Chance = require('chance')
var chance = new Chance()

describe('[integration] individuals life cycle', function () {
  it('should initialize Engine', function (done) {
    engine = new Engine({
      bus: {
        url: config.get('CQRS_RABBITMQ_URL')
      },
      source: path.resolve(basedir, 'example/application'),
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
      .catch(done)
  })
  it('should not create an individual because of joi validate before', function (done) {
    data = {
      email: true
    }
    engine.execute('CreateIndividualCommand', data)
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
  it('should create an individual', function (done) {
    data = {
      email: chance.email({domain: 'gmail.com'})
    }
    engine.execute('CreateIndividualCommand', data)
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
        expect(result.result).to.have.property('id')
        expect(result.result.id).to.be.a('string')
        data = result.result
        done()
      })
      .catch(done)
  })
  it('should get individual', function (done) {
    engine.execute('GetIndividualByIdQuery', data.id)
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
        expect(result.result).to.have.property('id')
        expect(result.result.id).to.be.a('string')
        done()
      })
      .catch(done)
  })
  it('should send events on bus to create 10 individuals in a row', function (done) {
    let current = 10
    engine.bus.subscribe('CreateIndividualCommand.Success', (event) => {
      current--
      if (current === 0) {
        done()
      } else {
        data = {
          email: chance.email({domain: 'gmail.com'}),
          createdAt: Date.now()
        }
        engine.bus.publish('CreateIndividualCommand.Event', data)
      }
    })
    data = {
      email: chance.email({domain: 'gmail.com'}),
      createdAt: Date.now()
    }
    engine.bus.publish('CreateIndividualCommand.Event', data)
  })
  it('should find some individuals', function (done) {
    let q = {
      email: data.email
    }
    engine.execute('FindIndividualsQuery', q)
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
