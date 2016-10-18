/* global describe:false, it:false */
'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const basedir = path.resolve(__dirname, '../../../..')

const Engine = require(basedir).Engine
const engine = new Engine({
  source: path.resolve(basedir, 'example/application'),
  patterns: ['**/*.js']
})

const Client = require(basedir).Client
const client = new Client()

let data
var Chance = require('chance')
var chance = new Chance()

describe('[integration] individuals life cycle', function () {
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
  it('should use a client to find some individuals', function (done) {
    client.initialize()
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should close all Rabbitmq', function (done) {
    engine.exit()
    done()
  })
})
