const Service = require('./Utils/Service')

class Command extends Service {
  constructor (name, handler) {
    super()
    this.type = 'Command'
    this.name = name
    this.EventSuccess = name + '.Success'
    this.EventError = name + '.Error'
    this.handler = handler
  }
  async execute (params = {}) {
    const result = await super.execute(params)
    return result
  }
}

module.exports = Command
