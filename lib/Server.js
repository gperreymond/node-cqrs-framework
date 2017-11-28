const uuid = require('uuid')
const EventEmitter = require('events').EventEmitter
const util = require('util')
const path = require('path')
const _ = require('lodash')
const glob = require('glob-promise')

const Command = require('./Command')
const Query = require('./Query')
const CQRSError = require('./Utils/CQRSError')
const cqrsError = new CQRSError()

const receiver = function (context, name, handler) {
  context.debug('receiver %s has been added', name)
  context.__receivers[name] = handler
  return context
}

class Server {
  constructor (bus) {
    this.debug = require('debug')('cqrs:server')
    this.uuid = uuid.v4()
    this.starttime = Date.now()
    this.servicebus = bus || require('servicebus')
    this.__receivers = {}
    EventEmitter.call(this)
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
      if (type === 'Command') receiver(this, name, new Command(name, require(filepath)))
      if (type === 'Query') receiver(this, name, new Query(name, require(filepath)))
    })
    return this
  }
  start (options) {
    this.debug('listen')
    this.options = this.options = Object.assign({
      host: 'localhost',
      port: 5672,
      user: 'guest',
      pass: 'guest',
      timeout: 2000,
      heartbeat: 10
    }, options)
    this.bus = this.servicebus.bus(this.options)
    this.bus.on('error', error => {
      this.emit('error', cqrsError.log('internal_error', {uuid: this.uuid, type: 'Client', name: 'Client', error}))
    })
    this.bus.on('ready', () => {
      const receivers = Object.keys(this.__receivers)
      receivers.map(name => {
        this.bus.listen(name, async (data) => {
          this.debug('receiver %s has been called with data %o', name, data)
          try {
            const result = await this.__receivers[name].execute(data)
            this.publish(result.event, result)
            if (data.__response) {
              this.publish(data.__response, result)
            }
          } catch (e) {
            this.bus.emit('error', e)
          }
        })
      })
      this.emit('ready')
    })
  }
  close () {
    this.bus.close()
  }
  publish (name, data) {
    this.debug('publisher %s has been sent with data %o', name, data)
    this.bus.publish(name, data)
  }
}

util.inherits(Server, EventEmitter)

module.exports = Server
