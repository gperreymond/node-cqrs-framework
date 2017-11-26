const path = require('path')
const expect = require('chai').expect

const ServicebusMock = require('../../mocks/ServicebusMock')
const Server = require('../../../lib/Server')

describe('[unit] class Server', () => {
  it('should fail to initialize, because context.options.source is mandatory', async () => {
    const server = new Server({
      __bus: new ServicebusMock(),
      bus: {
        port: 1111
      },
      patterns: ['data/commands/*.js', 'data/queries/*.js']
    })
    try {
      await server.initialize()
    } catch (error) {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('context_options_source_mandatory')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: context_options_source_mandatory')
    }
  })
  it('should fail to initialize, because no bus connected', async () => {
    const server = new Server({
      __bus: new ServicebusMock(),
      bus: {
        port: 1111
      },
      source: path.resolve(__dirname, '../../../test'),
      patterns: ['data/commands/*.js', 'data/queries/*.js']
    })
    try {
      await server.initialize()
    } catch (error) {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('bus_not_connected')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: bus_not_connected')
    }
  })
  it('should initialize succesfuly', async () => {
    const server = new Server({
      __bus: new ServicebusMock(),
      bus: {
        port: 6666
      },
      source: path.resolve(__dirname, '../../../test'),
      patterns: ['data/commands/*.js', 'data/queries/*.js']
    })
    await server.initialize()
  })
})
