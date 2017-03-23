'use strict'

const path = require('path')
const chai = require('chai')
const expect = chai.expect

// server configuration
const Server = require('../../').Server
const server = new Server({
  bus: {
    host: 'localhost',
    port: 5672,
    user: 'guest',
    pass: 'guest'
  },
  source: path.resolve(__dirname, '../..', 'examples'),
  patterns: [
    'integration/**/*.js'
  ]
})

describe('[integration] server stories', function () {
  beforeEach(function (done) {
    setTimeout(done, 1000)
  })

  it('should start', function (done) {
    server
      .initialize()
      .then(() => {
        expect(server.services).to.have.property('BasicNopeRejectCommand')
        expect(server.services).to.have.property('BasicNopeResolveCommand')
        done()
      })
      .catch(done)
  })
  it('should success publishing a command', function (done) {
    server.client.publish('BasicNopeResolveCommand', {test: true})
    done()
  })
  it('should fail publishing a command', function (done) {
    server.client.publish('BasicNopeRejectCommand', {test: true})
    done()
  })
  it('should success sending a command', function (done) {
    server.client.send('BasicNopeResolveCommand', {test: true}, (acknowledgement) => {
      done()
    })
  })
  it('should fail sending a command', function (done) {
    server.client.send('BasicNopeRejectCommand', {test: true}, (acknowledgement) => {
      done()
    })
  })
  it('should success requesting a command', function (done) {
    server.client.request('BasicNopeResolveCommand', {test: true}, (result) => {
      done()
    })
  })
  it('should fail requesting a command', function (done) {
    server.client.request('BasicNopeRejectCommand', {test: true}, (result) => {
      done()
    })
  })
})
