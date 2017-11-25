const debug = require('debug')('cqrs:client:connectors')

const CQRSError = require('../Utils/CQRSError')

module.exports = async (context) => {
  debug('start')
  const cqrsError = new CQRSError()
  try {
    // mandatory
    if (!context) throw cqrsError.log('context_mandatory', {uuid: '', type: 'Server', name: 'Server'})
    if (!context.options) throw cqrsError.log('context_options_mandatory', {uuid: context.uuid, type: 'Server', name: 'Server'})
    // code
    context.options.bus = Object.assign({
      host: 'localhost',
      port: 5672,
      user: 'guest',
      pass: 'guest',
      timeout: 2000,
      heartbeat: 10
    }, context.options.bus)
    context.__bus.on('connected', () => {
      debug('bus connected')
    })
    context.__bus.on('closed', () => {
      debug('bus closed')
    })
    await context.__bus.configure({ connection: context.options.bus }).catch(error => {
      throw cqrsError.log('bus_not_connected', {uuid: context.uuid, type: 'Client', name: 'Client', error})
    })
    debug('end')
    return true
  } catch (error) {
    debug('error %o', error)
    if (error.eraro === true) return error
    return cqrsError.log('connectors_internal_error', {uuid: context.uuid, type: 'Client', name: 'Client'})
  }
}
