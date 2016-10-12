'use strict'

const debug = require('debug')('engine:triggers')
const uuid = require('uuid')

class Trigger {
  constructor (name, handler) {
    this.uuid = uuid.v4()
    this.name = name
  }
  bind (engine) {
    this.engine = engine
    this.engine.bus.subscribe(this.name + '.Event', (params) => {
      debug('Trigger-%s-%s is called with params=%o', this.uuid, this.name, params)
      this.engine.execute(this.name, params)
    })
  }
}

module.exports = Trigger
