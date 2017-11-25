const expect = require('chai').expect

const RabbotMock = require('../../mocks/RabbotMock')
const connectors = require('../../../lib/Client/connectors')

describe('[unit] class Client - connectors', () => {
  it('should fail to configure connectors, because context is mandatory', async () => {
    const result = await connectors()
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('context_mandatory')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: context_mandatory')
  })
  it('should fail to configure connectors, because context.options is mandatory', async () => {
    const context = {}
    const result = await connectors(context)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('context_options_mandatory')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: context_options_mandatory')
  })
  it('should fail to configure connectors, because bus is not connected', async () => {
    const context = {
      __bus: new RabbotMock(),
      options: {
        bus: {
          port: 1111
        }
      }
    }
    const result = await connectors(context)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('bus_not_connected')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: bus_not_connected')
  })
  it('should configure connectors', async () => {
    const context = {
      __bus: new RabbotMock(),
      options: {
        bus: {
          port: 6666
        }
      }
    }
    const result = await connectors(context)
    expect(result).to.equal(true)
    context.__bus.emit('closed')
  })
})
