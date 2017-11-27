const debug = require('debug')('cqrs:client:subscribers')

module.exports = (context) => {
  debug('start')
  const subscribers = Object.keys(context.__subscribers)
  subscribers.map(name => {
    debug('subscriber %o has been added', name)
    const handler = context.__subscribers[name]
    context.__bus.subscribe(name, handler, {type: 'fanout', exchangeName: 'amq.fanout'})
  })
  debug('end')
  return true
}
