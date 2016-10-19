/* global describe:false, it:false */
'use strict'

const Server = require('../..').Server
const Client = require('../..').Client

const chai = require('chai')
const expect = chai.expect

describe('[unit] errors', function () {
  it('should be catch on server without rabbitmq connection', function (done) {
    const server = new Server({
      connection: {
        port: 5680
      }
    })
    server.initialize()
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.be.an('error')
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
  it('hould be catch on server without files to initialize CQRS', function (done) {
    const server = new Server({
      source: 'no_files_here_to_initialize'
    })
    server.initialize()
      .then(() => {
        done(new Error('no error detected'))
      })
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
  it('should be catch on server without options on initialize', function (done) {
    const server = new Server()
    server.initialize()
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.be.an('error')
        expect(error).to.have.property('eraro')
        expect(error).to.have.property('cqrs-framework')
        expect(error).to.have.property('details')
        expect(error).to.have.property('code')
        expect(error.eraro).to.be.equal(true)
        expect(error.code).to.be.equal('server_error_no_file')
        expect(error['cqrs-framework']).to.be.equal(true)
        expect(error.details).to.be.an('object')
        done()
      })
  })
  it('should be catch on client without rabbitmq connection', function (done) {
    const client = new Client({
      connection: {
        port: 5680
      }
    })
    client.send('NopeCommand', {})
      .then(() => {
        done(new Error('no error detected'))
      })
      .catch((error) => {
        expect(error).to.be.an('error')
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
