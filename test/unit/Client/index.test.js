const expect = require('chai').expect

const RabbotMock = require('../../mocks/RabbotMock')
const Client = require('../../../lib/Client')

describe('[unit] class Client', () => {
  it('should fail to initialize whitout options', async () => {
    const client = new Client()
    try {
      await client.initialize()
    } catch (error) {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('bus_not_connected')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: bus_not_connected')
    }
  })
  it('should fail to initialize, because no bus connected', async () => {
    const client = new Client({
      bus: {
        port: 1111
      }
    })
    try {
      await client.initialize()
    } catch (error) {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('bus_not_connected')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: bus_not_connected')
    }
  })
  it('should success to initialize', async () => {
    const client = new Client({
      bus: {
        port: 6666
      }
    })
    client.__bus = new RabbotMock()
    await client.initialize()
    client.__bus.emit('closed')
  })
})
