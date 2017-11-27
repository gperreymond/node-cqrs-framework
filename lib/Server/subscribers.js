const debug = require('debug')('cqrs:server:subscribers')

module.exports = (context) => {
  debug('start')
  const subscribers = Object.keys(context.__handlers)
  subscribers.map(key => {
    debug('subscribers %o has been added', key)
    const handler = context.__handlers[key]
    context.__bus.subscribe(handler.name, async (params) => {
      debug('subscriber %o has been called', handler.name)
      const result = await context.__handlers[handler.name].execute(params)
      context.publish(result.event, result)
    }, {type: 'fanout', exchangeName: 'amq.fanout'})
  })
  debug('end')
  return true
}
