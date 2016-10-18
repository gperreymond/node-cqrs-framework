/* global describe:false, it:false */
'use strict'

const Client = require('../..').Client

const chai = require('chai')
const expect = chai.expect

describe('[unit] class client', function () {
  it('should not initialize without rabbitmq', function (done) {
    let client = new Client({
      bus: {
        url: 'amqp://localhost:6666'
      }
    })
    client.initialize()
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
  it('should start', function (done) {
    let client = new Client()
    client.initialize()
      .then(() => {
        done()
      })
      .catch(done)
  })
})
