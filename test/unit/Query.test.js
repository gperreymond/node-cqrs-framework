const expect = require('chai').expect

const Query = require('../../lib/Query')

describe('[unit] class Query', () => {
  it('should execute and return a result', async () => {
    const handler = function (params) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve({test: true})
        }, 50)
      })
    }
    const query = new Query('BasicNopeQuery', handler)
    const result = await query.execute()
    expect(query.uuid).to.be.a('string')
    expect(result.type).to.equal('Query')
    expect(result.name).to.equal('BasicNopeQuery')
    expect(result.event).to.equal('BasicNopeQuery.Success')
    expect(result.result.test).to.equal(true)
  })
  it('should execute, and return an error', async () => {
    const handler = function (params) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject(new Error('TEST'))
        }, 50)
      })
    }
    const query = new Query('BasicNopeQuery', handler)
    const result = await query.execute()
    expect(query.uuid).to.be.a('string')
    expect(result.result.eraro).to.equal(true)
    expect(result.result.code).to.equal('service_error')
    expect(result.result['cqrs-framework']).to.equal(true)
    expect(result.result.package).to.equal('cqrs-framework')
    expect(result.result.msg).to.equal('cqrs-framework: service_error')
    expect(result.type).to.equal('Query')
    expect(result.name).to.equal('BasicNopeQuery')
    expect(result.event).to.equal('BasicNopeQuery.Error')
  })
})
