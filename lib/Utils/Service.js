const uuid = require('uuid')

const CQRSError = require('./CQRSError')

class Service {
  constructor () {
    this.uuid = uuid.v4()
  }
  async execute (params = {}) {
    const cqrsError = new CQRSError()
    const starttime = Date.now()
    try {
      if (!this.handler) throw cqrsError.log('service_handler_undefined')
      if (!this.type) throw cqrsError.log('service_type_undefined')
      if (!this.name) throw cqrsError.log('service_name_undefined')
      const result = await this.handler(params)
      const exectime = Date.now() - starttime
      let p = {
        type: this.type + '.Success',
        name: this.name,
        params,
        exectime
      }
      if (this.type === 'Query') { p.result = result }
      return p
    } catch (error) {
      if (!error.eraro) return cqrsError.log('service_error', {type: this.type + '.Error', name: this.name, error})
      return error
    }
  }
}

module.exports = Service
