const path = require('path')
const expect = require('chai').expect

const getHandlers = require('../../../lib/Server/getHandlers')

describe('[unit] class Server', () => {
  it('should fail to load handlers, because patterns is undefined', (done) => {
    const contextMock = {
      log: {
        debug () {}
      },
      options: {}
    }
    const result = getHandlers(contextMock)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('options_patterns_undefined')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: options_patterns_undefined')
    done()
  })
  it('should fail to load handlers, because source is undefined', (done) => {
    const contextMock = {
      log: {
        debug () {}
      },
      options: {
        patterns: []
      }
    }
    const result = getHandlers(contextMock)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('options_source_undefined')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: options_source_undefined')
    done()
  })
  it('should fail to load handlers, because no files found', (done) => {
    const contextMock = {
      log: {
        debug () {}
      },
      options: {
        source: path.resolve(__dirname),
        patterns: []
      }
    }
    const result = getHandlers(contextMock)
    expect(result.eraro).to.equal(true)
    expect(result.code).to.equal('options_handlers_not_found')
    expect(result['cqrs-framework']).to.equal(true)
    expect(result.package).to.equal('cqrs-framework')
    expect(result.msg).to.equal('cqrs-framework: options_handlers_not_found')
    done()
  })
  it('should load handlers', (done) => {
    const contextMock = {
      log: {
        debug () {}
      },
      options: {
        source: path.resolve(__dirname, '../../../test'),
        patterns: ['data/commands/*.js', 'data/queries/*.js']
      }
    }
    const result = getHandlers(contextMock)
    expect(result).to.be.an('array')
    done()
  })
})
