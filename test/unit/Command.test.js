const expect = require('chai').expect

const Command = require('../../lib/Command')

describe('[unit] class Command', () => {
  it('should execute and return a result', async () => {
    const handler = function (params) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          resolve({test: true})
        }, 50)
      })
    }
    const command = new Command('BasicNopeCommand', handler)
    const result = await command.execute()
    expect(command.uuid).to.be.a('string')
    expect(result.type).to.equal('Command.Success')
    expect(result.name).to.equal('BasicNopeCommand')
  })
  it('should execute, and return an error', async () => {
    const handler = function (params) {
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          reject(new Error('TEST'))
        }, 50)
      })
    }
    const command = new Command('BasicNopeCommand', handler)
    expect(command.uuid).to.be.a('string')
    const result = await command.execute()
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('service_error')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: service_error')
    expect(result.details.type).to.equal('Command.Error')
    expect(result.details.name).to.equal('BasicNopeCommand')
  })
})
