const path = require('path')
const expect = require('chai').expect

const handlers = require('../../../lib/Server/handlers')

describe('[unit] class Server - handlers', () => {
  it('should fail to configure handlers, because context is mandatory', async () => {
    const result = await handlers()
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('context_mandatory')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: context_mandatory')
  })
  it('should fail to configure handlers, because context.options is mandatory', async () => {
    const context = {}
    const result = handlers(context)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('context_options_mandatory')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: context_options_mandatory')
  })
  it('should fail to configure handlers, because context.options.patterns is mandatory', async () => {
    const context = {
      options: {}
    }
    const result = handlers(context)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('context_options_patterns_mandatory')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: context_options_patterns_mandatory')
  })
  it('should fail to configure handlers, because context.options.source is mandatory', async () => {
    const context = {
      options: {
        patterns: []
      }
    }
    const result = handlers(context)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('context_options_source_mandatory')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: context_options_source_mandatory')
  })
  it('should fail to configure handlers, because no files found', async () => {
    const context = {
      options: {
        source: path.resolve(__dirname),
        patterns: []
      }
    }
    const result = handlers(context)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('handlers_not_found')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: handlers_not_found')
  })
  it('should fail to configure handlers, because a filename is not good', async () => {
    const context = {
      __handlers: {},
      options: {
        source: path.resolve(__dirname, '../../../test'),
        patterns: ['data/bad/*.js']
      }
    }
    const result = handlers(context)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('bad_file_name')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: bad_file_name')
  })
  it('should configure handlers', async () => {
    const context = {
      __handlers: {},
      options: {
        source: path.resolve(__dirname, '../../../test'),
        patterns: ['data/commands/*.js', 'data/queries/*.js']
      }
    }
    const result = handlers(context)
    expect(result).to.equal(true)
    expect(context.__handlers).to.have.property('BasicNopeCommand')
    expect(context.__handlers).to.have.property('BasicNopeQuery')
  })
})
