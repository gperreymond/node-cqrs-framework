const path = require('path')
const glob = require('glob-promise')
const _ = require('lodash')

const CQRSError = require('../utils/CQRSError')

module.exports = (context) => {
  context.log.debug('getHandlers')
  const cqrsError = new CQRSError()
  try {
    if (!context.options.patterns) throw cqrsError.log('options_patterns_undefined', {uuid: context.uuid, type: 'Server', name: 'Server'})
    if (!context.options.source) throw cqrsError.log('options_source_undefined', {uuid: context.uuid, type: 'Server', name: 'Server'})
    let handlers = []
    _.map(context.options.patterns, async (pattern) => {
      let patternPath = path.resolve(context.options.source, pattern)
      handlers = _.union(handlers, glob.sync(patternPath, {mark: true}))
    })
    if (handlers.length === 0) throw cqrsError.log('options_handlers_not_found', {uuid: context.uuid, type: 'Server', name: 'Server'})
    return handlers
  } catch (error) {
    return error
  }
}
