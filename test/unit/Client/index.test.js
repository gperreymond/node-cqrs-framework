const expect = require('chai').expect

const ServicebusMock = require('../../mocks/ServicebusMock')
const Client = require('../../../lib/Client')

describe('[unit] class Client', () => {
  it('should fail to initialize, because no bus connected', (done) => {
    const client = new Client({
      __bus: new ServicebusMock(),
      bus: {
        port: 1111
      }
    })
    client.initialize().catch(error => {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('bus_not_connected')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: bus_not_connected')
      done()
    })
  })
  it('should success to initialize', (done) => {
    const client = new Client({
      __bus: new ServicebusMock(),
      bus: {
        port: 6666
      }
    })
    client.initialize().then(() => { done() })
  })
})
