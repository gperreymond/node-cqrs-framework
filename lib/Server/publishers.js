const debug = require('debug')('cqrs:server:publishers')

const Rabbus = require('../Utils/Rabbus')

module.exports = (context) => {
  debug('start')
  const handlers = Object.keys(context.__handlers)
  handlers.map(key => {
    debug('add %s to publishers', key)
    const handler = context.__handlers[key]
    context.__publishers[handler.EventSucess] = new Rabbus.Publisher(context.__bus, handler.EventSucess)
    context.__publishers[handler.EventError] = new Rabbus.Publisher(context.__bus, handler.EventError)
  })
  debug('end')
  return true
}
