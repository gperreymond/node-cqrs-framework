const expect = require('chai').expect

const Service = require('../../../lib/Utils/Service')

describe.only('[unit] class Service', () => {
  it('should initialize', async () => {
    const service = new Service()
    expect(service.uuid).to.be.a('string')
  })
  it('should fail to execute a handler, because handler is undefined', async () => {
    const service = new Service()
    const result = await service.execute()
    expect(service.uuid).to.be.a('string')
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('service_handler_undefined')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: service_handler_undefined')
  })
  it('should fail to execute a handler, because type is undefined', async () => {
    const service = new Service()
    service.handler = true
    const result = await service.execute()
    expect(service.uuid).to.be.a('string')
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('service_type_undefined')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: service_type_undefined')
  })
  it('should fail to execute a handler, because name is undefined', async () => {
    const service = new Service()
    service.type = 'Query'
    service.handler = true
    const result = await service.execute()
    expect(service.uuid).to.be.a('string')
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('service_name_undefined')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: service_name_undefined')
  })
  it('should success to execute a command, and return an error', async () => {
    const service = new Service()
    expect(service.uuid).to.be.a('string')
    service.name = 'BasicNopeCommand'
    service.type = 'Command'
    service.handler = function (params) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject(new Error('TEST'))
        }, 50)
      })
    }
    const result = await service.execute()
    expect(service.uuid).to.be.a('string')
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('service_error')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: service_error')
    expect(result.details.type).to.equal('Command.Error')
    expect(result.details.name).to.equal('BasicNopeCommand')
  })
  it('should success to execute a command, and return a result', async () => {
    const service = new Service()
    expect(service.uuid).to.be.a('string')
    service.name = 'BasicNopeCommand'
    service.type = 'Command'
    service.handler = function (params) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve({test: true})
        }, 50)
      })
    }
    const result = await service.execute()
    expect(service.uuid).to.be.a('string')
    expect(result.type).to.equal('Command.Success')
    expect(result.name).to.equal('BasicNopeCommand')
  })
  it('should success to execute a query, and return a result', async () => {
    const service = new Service()
    expect(service.uuid).to.be.a('string')
    service.name = 'BasicNopeQuery'
    service.type = 'Query'
    service.handler = function (params) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve({test: true})
        }, 50)
      })
    }
    const result = await service.execute()
    expect(service.uuid).to.be.a('string')
    expect(result.type).to.equal('Query.Success')
    expect(result.name).to.equal('BasicNopeQuery')
    expect(result.result.test).to.equal(true)
  })
})
