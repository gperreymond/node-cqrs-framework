const path = require('path')
const expect = require('chai').expect

const ServicebusMock = require('../../mocks/ServicebusMock')
const Server = require('../../../lib/Server')

describe('[unit] class Server', () => {
  it('should fail to initialize, because context.options.source is mandatory', (done) => {
    const server = new Server({
      __bus: new ServicebusMock(),
      patterns: ['data/commands/*.js', 'data/queries/*.js']
    })
    server.initialize().catch(error => {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('context_options_source_mandatory')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: context_options_source_mandatory')
      done()
    })
  })
  it('should fail to initialize, because no bus connected', (done) => {
    const server = new Server({
      __bus: new ServicebusMock(),
      bus: {
        port: 1111
      },
      source: path.resolve(__dirname, '../../../test'),
      patterns: ['data/commands/*.js', 'data/queries/*.js']
    })
    server.initialize().catch(error => {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('bus_not_connected')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: bus_not_connected')
      done()
    })
  })
  it('should initialize succesfuly with options.__bus', (done) => {
    const server = new Server({
      __bus: new ServicebusMock(),
      bus: {
        port: 6666
      },
      source: path.resolve(__dirname, '../../../test'),
      patterns: ['data/commands/*.js', 'data/queries/*.js']
    })
    server.initialize().then(() => { done() })
  })
})
