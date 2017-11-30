const expect = require('chai').expect

const ServicebusMock = require('../../mocks/ServicebusMock')
const connectors = require('../../../lib/Utils/Connectors')

describe('[unit] class Connectors', () => {
  it('should fail to configure connectors, because context.options is mandatory', async () => {
    const context = {}
    await connectors(context).catch(error => {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('context_options_mandatory')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: context_options_mandatory')
    })
  })
  it('should fail to configure connectors, because bus is not connected', (done) => {
    const context = {
      __bus: new ServicebusMock(),
      options: {
        bus: {
          port: 1111
        }
      }
    }
    connectors(context).catch(error => {
      expect(error.eraro).to.equal(true)
      expect(error.code).to.equal('bus_not_connected')
      expect(error['cqrs-framework']).to.equal(true)
      expect(error.package).to.equal('cqrs-framework')
      expect(error.msg).to.equal('cqrs-framework: bus_not_connected')
      done()
    })
  })
  it('should configure connectors', async () => {
    const context = {
      __bus: new ServicebusMock(),
      options: {
        bus: {
          port: 6666
        }
      }
    }
    connectors(context).then(result => {
      expect(result).to.equal(true)
    })
  })
})
