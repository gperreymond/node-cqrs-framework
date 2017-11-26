const debug = require('debug')('cqrs:server:publishers')

module.exports = (context) => {
  debug('start')
  const handlers = Object.keys(context.__handlers)
  handlers.map(key => {
    debug('add %s to publishers', key)
    const handler = context.__handlers[key]
    context.__bus.subscribe(handler.name, async (params) => {
      const result = await context.__handlers[handler.name].execute(params)
      debug(result)
    })
  })
  debug('end')
  return true
}
