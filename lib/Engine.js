'use strict'

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
    this.commands = {}
    this.queries = {}
    this.error = Eraro({
      package: 'cqrs-framework',
      msgmap: Errors,
      override: true
    })
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
      let type = 'none'
      let name = _.camelCase(path.basename(filepath, '.js'))
      if (name.indexOf('Command') !== -1) { type = 'command' }
      if (name.indexOf('Query') !== -1) { type = 'query' }
      if (type === 'command') {
        this.commands[name] = new Command(name, handler)
      }
      if (type === 'query') {
        this.queries[name] = new Query(name, handler)
      }
    })
  }
  makedie (err) {
    throw err
  }
}

module.exports = Engine
