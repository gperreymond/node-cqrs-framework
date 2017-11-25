const debug = require('debug')('cqrs:server:connectors')

const CQRSError = require('../Utils/CQRSError')

module.exports = async (context) => {
  debug('start')
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
  const cqrsError = new CQRSError()
  try {
    await context.__bus.configure({ connection: context.options.bus }).catch(error => {
      throw cqrsError.log('bus_not_connected', {uuid: context.uuid, type: 'Server', name: 'Server', error})
    })
    debug('end')
    return true
  } catch (error) {
    debug('error %o', error)
    if (error.eraro === true) return error
    return cqrsError.log('connectors_internal_error', {uuid: context.uuid, type: 'Server', name: 'Server'})
  }
}
