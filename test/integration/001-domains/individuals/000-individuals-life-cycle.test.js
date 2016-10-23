'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const basedir = path.resolve(__dirname, '../../../..')

const Server = require(basedir).Server
const server = new Server({
  source: path.resolve(basedir, 'example/application'),
  patterns: ['**/*.js']
})

let data
var Chance = require('chance')
var chance = new Chance()

describe('[integration] individuals life cycle', function () {
  it('should initialize Server', function (done) {
    server.initialize()
      .then(() => {
        expect(server).to.be.an('object')
        expect(server).to.have.property('options')
        expect(server).to.have.property('starttime')
        expect(server).to.have.property('uuid')
        expect(server.options).to.be.an('object')
        expect(server.uuid).to.be.a('string')
        expect(server.starttime).to.be.a('number')
        done()
      })
      .catch(done)
  })
  it('should not create an individual because of joi validate before', function (done) {
    data = {
      email: true
    }
    server.execute('CreateIndividualCommand', data)
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
    server.execute('CreateIndividualCommand', data)
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result).to.have.property('uuid')
        expect(result).to.have.property('type')
        expect(result).to.have.property('name')
        expect(result).to.have.property('exectime')
        expect(result).to.have.property('result')
        expect(result.uuid).to.be.a('string')
        expect(result.type).to.be.a('string')
        expect(result.name).to.be.a('string')
        expect(result.result).to.be.a('boolean').to.be.eq(true)
        done()
      })
      .catch(done)
  })
  it('should find some individuals', function (done) {
    let q = {
      email: data.email
    }
    server.execute('FindIndividualsQuery', q)
      .then((result) => {
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
        data = result.result.data[1]
        done()
      })
      .catch(done)
  })
  it('should get individual', function (done) {
    server.execute('GetIndividualByIdQuery', data.id)
      .then((result) => {
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
})
