const debug = require('debug')('cqrs:connectors')

const CQRSError = require('../Utils/CQRSError')

module.exports = (context) => {
  debug('start')
  const cqrsError = new CQRSError()
  return new Promise((resolve, reject) => {
    try {
      // mandatory
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
      context.__bus = context.__bus.bus(context.options.bus)
      context.__bus.on('error', error => {
        debug('error')
        return reject(cqrsError.log('bus_not_connected', {uuid: context.uuid, type: 'Server', name: 'Server', error}))
      })
      context.__bus.on('ready', () => {
        debug('ready')
        return resolve(true)
      })
    } catch (error) {
      debug('error %o', error)
      if (error.eraro === true) return reject(error)
      reject(cqrsError.log('connectors_internal_error', {uuid: context.uuid, type: 'Server', name: 'Server'}))
    }
  })
}
