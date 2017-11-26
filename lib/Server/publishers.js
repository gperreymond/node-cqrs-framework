const debug = require('debug')('cqrs:server:publishers')

module.exports = (context) => {
  debug('start')
  const handlers = Object.keys(context.__handlers)
  handlers.map(key => {
    debug('add %s to publishers', key)
    // const handler = context.__handlers[key]
  })
  debug('end')
  return true
}
