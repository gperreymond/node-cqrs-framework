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
        type: this.type,
        name: this.name,
        event: this.EventSuccess,
        params,
        exectime
      }
      if (this.type === 'Query') { p.result = result }
      return p
    } catch (error) {
      let p = {}
      if (!error.eraro) {
        p = {
          type: this.type,
          name: this.name,
          event: this.EventError,
          params,
          result: cqrsError.log('service_error', {type: this.type + '.Error', name: this.name, error})
        }
      } else {
        p = {
          type: this.EventError,
          name: this.name,
          params,
          result: error
        }
      }
      return p
    }
  }
}

module.exports = Service
