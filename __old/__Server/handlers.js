const debug = require('debug')('cqrs:server:handlers')

const path = require('path')
const glob = require('glob-promise')
const _ = require('lodash')

const Command = require('../Command')
const Query = require('../Query')
const CQRSError = require('../Utils/CQRSError')

module.exports = (context) => {
  debug('start')
  const cqrsError = new CQRSError()
  try {
    // mandatory
    if (!context) throw cqrsError.log('context_mandatory', {uuid: '', type: 'Server', name: 'Server'})
    if (!context.options) throw cqrsError.log('context_options_mandatory', {uuid: context.uuid, type: 'Server', name: 'Server'})
    if (!context.options.patterns) throw cqrsError.log('context_options_patterns_mandatory', {uuid: context.uuid, type: 'Server', name: 'Server'})
    if (!context.options.source) throw cqrsError.log('context_options_source_mandatory', {uuid: context.uuid, type: 'Server', name: 'Server'})
    // code
    let handlers = []
    _.map(context.options.patterns, (pattern) => {
      let patternPath = path.resolve(context.options.source, pattern)
      handlers = _.union(handlers, glob.sync(patternPath, {mark: true}))
    })
    if (handlers.length === 0) throw cqrsError.log('handlers_not_found', {uuid: context.uuid, type: 'Server', name: 'Server'})
    _.map(handlers, filepath => {
      let name = _.upperFirst(_.camelCase(path.basename(filepath, '.js')))
      let type = 'None'
      if (name.indexOf('Command') !== -1) { type = 'Command' }
      if (name.indexOf('Query') !== -1) { type = 'Query' }
      if (type === 'None') {
        throw cqrsError.log('bad_file_name', {uuid: context.uuid, type: 'Server', name: 'Server'})
      }
      debug('add %s to handlers', name)
      if (type === 'Command') { context.__handlers[name] = new Command(name, require(filepath)) }
      if (type === 'Query') { context.__handlers[name] = new Query(name, require(filepath)) }
    })
    debug('ready')
    return true
  } catch (error) {
    debug('error %o', error)
    if (error.eraro === true) return error
    return cqrsError.log('handlers_internal_error', {uuid: context.uuid, type: 'Server', name: 'Server'})
  }
}
