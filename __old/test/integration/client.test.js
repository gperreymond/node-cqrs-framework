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

// client configuration
const options = {
  bus: {
    host: 'localhost',
    port: 5672,
    user: 'guest',
    pass: 'guest'
  }
}
const Client = require('../..').Client
const client = new Client(options.bus)

describe('[integration] client stories', function () {
  beforeEach(function (done) {
    setTimeout(done, 1000)
  })

  it('should start the server', function (done) {
    server
      .initialize()
      .then(() => {
        expect(server.services).to.have.property('BasicNopeRejectCommand')
        expect(server.services).to.have.property('BasicNopeResolveCommand')
        done()
      })
      .catch(done)
  })
  it('should start the client', function (done) {
    client
      .subscribe('BasicNopeResolveCommand.Success', () => {
      })
      .subscribe('BasicNopeRejectCommand.Error', () => {
      })
      .initialize()
      .then(() => {
        done()
      })
      .catch(done)
  })
  it('should use the client and publish a command for a resolve', function (done) {
    client.publish('BasicNopeResolveCommand', {test: true})
    done()
  })
  it('should use the client and publish a command for a reject', function (done) {
    client.publish('BasicNopeRejectCommand', {test: true})
    done()
  })
  it('should use the client and send a command for a resolve', function (done) {
    client.send('BasicNopeResolveCommand', {test: true}, (result) => {
      done()
    })
  })
  it('should use the client and request a command for a resolve', function (done) {
    client.request('BasicNopeResolveCommand', {test: true}, (result) => {
      done()
    })
  })
})
