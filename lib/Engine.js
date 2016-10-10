'use strict'

const Promise = require('bluebird')
const Hoek = require('hoek')
const Eraro = require('eraro')
const Errors = require('./helpers/errors')

const path = require('path')
const glob = require('glob')
const _ = require('lodash')
const uuid = require('uuid')

const Command = require('./Command')
const Query = require('./Query')

let internals = {}
internals.options = {
  bus: {
    url: 'amqp://localhost'
  },
  source: __dirname,
  patterns: [
    '**/*.js'
  ]
}

class Engine {
  constructor (options) {
    this.uuid = uuid.v4()
    this.options = Hoek.applyToDefaults(internals.options, options || {})
    this.starttime = Date.now()
    this.CQRS = {}
    this.error = Eraro({
      package: 'cqrs-framework',
      msgmap: Errors,
      override: true
    })
    this.bus = require('servicebus').bus(this.options.bus.url)
    this.initialize()
  }
  initialize () {
    // initialize cqrs-framework or die
    let files = []
    _.map(this.options.patterns, (pattern) => {
      let patternPath = path.resolve(this.options.source, pattern)
      let __files = glob.sync(patternPath, {mark: true, sync: true})
      files = _.union(files, __files)
    })
    if (files.length === 0) {
      return this.makedie(this.error('engine_error_no_file', {uuid: this.uuid, type: 'Engine', name: 'Engine'}))
    }
    // load commands and queries handlers
    _.map(files, (filepath) => {
      let handler = require(filepath)
      let name = _.camelCase(path.basename(filepath, '.js'))
      if (name.indexOf('Command') !== -1) {
        this.CQRS[name] = {
          Prototype: Command,
          name,
        handler}
      }
      if (name.indexOf('Query') !== -1) {
        this.CQRS[name] = {
          Prototype: Query,
          name,
        handler}
      }
    })
  }
  execute (name, params) {
    return new Promise((resolve, reject) => {
      const Prototype = this.CQRS[name]['Prototype']
      const handler = new Prototype(name, this.CQRS[name]['handler'])
      handler.execute(params)
        .then((result) => {
          // send publish event success on the bus
          this.bus.publish(handler.EventSuccess, result)
          // return result
          resolve(result)
        })
        .catch(reject)
    })
  }
  makedie (err) {
    throw err
  }
}

module.exports = Engine
