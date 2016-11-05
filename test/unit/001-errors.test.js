'use strict'

const Server = require('../..').Server
const Client = require('../..').Client

const chai = require('chai')
const expect = chai.expect

const RabbotMock = require('../mocks/Rabbot')
const rabbotMock = new RabbotMock()

describe('[unit] errors', function () {
  it('should be catch on server without valid rabbitmq connection', function (done) {
    const server = new Server({
      rabbot: rabbotMock,
      bus: {
        port: 1111
      }
    })
    server.initialize()
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('cqrs-framework')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('server_error_no_bus_connected')
        expect(error['cqrs-framework']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        done()
      })
  })
  it('should be catch on server without files to initialize CQRS', function (done) {
    const server = new Server({
      rabbot: rabbotMock,
      bus: {
        port: 6666
      },
      source: 'no_files_here_to_initialize'
    })
    server.initialize()
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('cqrs-framework')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error['cqrs-framework']).to.be.equal(true)
        expect(error.code).to.be.equal('server_error_no_file')
        expect(error.details).to.be.an('object')
        done()
      })
  })
  it('should be catch on server without options on initialize', function (done) {
    const server = new Server({
      rabbot: rabbotMock,
      bus: {
        port: 1111
      }
    })
    server.initialize()
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('cqrs-framework')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('server_error_no_bus_connected')
        expect(error['cqrs-framework']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        done()
      })
  })
  it('should be catch on client without rabbitmq connection', function (done) {
    const client = new Client({
      rabbot: rabbotMock,
      port: 1111
    })
    client.initialize()
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('cqrs-framework')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('client_error_no_bus_connected')
        expect(error['cqrs-framework']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        done()
      })
  })
})
