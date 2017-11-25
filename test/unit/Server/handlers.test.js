const path = require('path')
const expect = require('chai').expect

const handlers = require('../../../lib/Server/handlers')

describe('[unit] class Server - handlers', () => {
  it('should fail to load services, because patterns is undefined', (done) => {
    const contextMock = {
      options: {}
    }
    const result = handlers(contextMock)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('options_patterns_undefined')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: options_patterns_undefined')
    done()
  })
  it('should fail to load services, because source is undefined', (done) => {
    const contextMock = {
      options: {
        patterns: []
      }
    }
    const result = handlers(contextMock)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('options_source_undefined')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: options_source_undefined')
    done()
  })
  it('should fail to load services, because no files found', (done) => {
    const contextMock = {
      options: {
        source: path.resolve(__dirname),
        patterns: []
      }
    }
    const result = handlers(contextMock)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('options_handlers_not_found')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: options_handlers_not_found')
    done()
  })
  it('should not load services, because a name is not good', (done) => {
    const contextMock = {
      __handlers: {},
      options: {
        source: path.resolve(__dirname, '../../../test'),
        patterns: ['data/bad/*.js']
      }
    }
    const result = handlers(contextMock)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('bad_file_name')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: bad_file_name')
    done()
  })
  it('should load services', (done) => {
    const contextMock = {
      __handlers: {},
      options: {
        source: path.resolve(__dirname, '../../../test'),
        patterns: ['data/commands/*.js', 'data/queries/*.js']
      }
    }
    const result = handlers(contextMock)
    expect(result).to.equal(true)
    expect(contextMock.__handlers).to.have.property('BasicNopeCommand')
    expect(contextMock.__handlers).to.have.property('BasicNopeQuery')
    done()
  })
})
