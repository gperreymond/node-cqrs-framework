'use strict'

const debug = require('debug')('cqrs:trigger')
const uuid = require('uuid')

class Trigger {
  constructor (name) {
    this.uuid = uuid.v4()
    this.type = 'Trigger'
    this.name = name
  }
  bind (engine) {
    this.engine = engine
    this.engine.bus.subscribe(this.name + '.Event', (params) => {
      debug('Trigger-%s-%s is called with params=%o', this.name, this.uuid, params)
      this.engine.execute(this.name, params)
    })
  }
}

module.exports = Trigger
