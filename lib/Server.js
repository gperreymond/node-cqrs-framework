const path = require('path')
const _ = require('lodash')
const glob = require('glob-promise')

const Client = require('./Client')
const Command = require('./Command')
const Query = require('./Query')
const CQRSError = require('./Utils/CQRSError')
const cqrsError = new CQRSError()

class Server extends Client {
  constructor (bus) {
    super(bus)
    this.debug = require('debug')('cqrs:server')
  }
  use (dirpath) {
    this.debug('use %s', dirpath)
    const files = glob.sync(dirpath)
    files.map(filepath => {
      let name = _.upperFirst(_.camelCase(path.basename(filepath, '.js')))
      let type = 'None'
      if (name.indexOf('Command') !== -1) { type = 'Command' }
      if (name.indexOf('Query') !== -1) { type = 'Query' }
      if (type === 'None') {
        this.emit('error', cqrsError.log('bad_file_name', {uuid: this.uuid, type: 'Server', name: 'Server'}))
        return this
      }
      if (type === 'Command') this.subscribe(name, new Command(name, require(filepath)))
      if (type === 'Query') this.subscribe(name, new Query(name, require(filepath)))
    })
    return this
  }
}

module.exports = Server
