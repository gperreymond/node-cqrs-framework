const path = require('path')
const rewire = require('rewire')
const expect = require('chai').expect

const ServicebusMock = require('../mocks/ServicebusMock')
let Server = rewire('../../lib/Server')
Server.__set__('servicebus', new ServicebusMock())

describe('[unit] the server', () => {
  it('should fail to start, because no bus connected', (done) => {
    const server = new Server()
    server.start({port: 1111})
    server.on('error', error => {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('internal_error')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: internal_error')
      done()
    })
  })
  it('should success to start, and use commands and queries', (done) => {
    const server = new Server()
    server
      .use(path.resolve(__dirname, '../data/nothing/*.js'))
      .use(path.resolve(__dirname, '../data/commands/*.js'))
      .use(path.resolve(__dirname, '../data/queries/*.js'))
      .start({port: 6666})
    server.on('ready', () => {
      expect(server.__receivers).to.be.an('object')
      expect(server.__receivers.BasicNopeCommand).to.be.an('object')
      expect(server.__receivers.BasicNopeCommand.type).to.equal('Command')
      expect(server.__receivers).to.be.an('object')
      expect(server.__receivers.BasicNopeQuery).to.be.an('object')
      expect(server.__receivers.BasicNopeQuery.type).to.equal('Query')
      server.close()
      done()
    })
  })
  it('should success to start, and publish', (done) => {
    const server = new Server()
    server
      .start({port: 6666})
    server.on('ready', () => {
      server.bus.publish = (name, data) => {
        expect(name).to.equal('BasicTestCommand')
        done()
      }
      server.publish('BasicTestCommand', {test: true})
    })
  })
})
