const expect = require('chai').expect

const ServicebusMock = require('../mocks/ServicebusMock')
const Client = require('../../lib/Client')

describe('[unit] the client', () => {
  it('should fail to start, because no bus connected', (done) => {
    const servicebus = new ServicebusMock()
    const client = new Client(servicebus)
    client.start({port: 1111})
    client.on('error', error => {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('internal_error')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: internal_error')
      done()
    })
  })
  it('should success to start, and close', (done) => {
    const servicebus = new ServicebusMock()
    const client = new Client(servicebus)
    client
      .subscribe('BasicTestCommand', () => {})
      .start({port: 6666})
    client.on('ready', () => {
      expect(client.__subscribers).to.be.an('object')
      expect(client.__subscribers.BasicTestCommand).to.be.a('function')
      client.close()
      done()
    })
  })
  it('should success to start, and send', (done) => {
    const servicebus = new ServicebusMock()
    const client = new Client(servicebus)
    client
      .start({port: 6666})
    client.on('ready', () => {
      client.bus.send = (name, data) => {
        expect(name).to.equal('BasicTestCommand')
        done()
      }
      client.send('BasicTestCommand', {test: true})
    })
  })
})
