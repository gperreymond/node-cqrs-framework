'use strict'

const Promise = require('bluebird')

const Server = require('../..').Server
const Client = require('../..').Client

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const basedir = path.resolve(__dirname, '../..')

const server = new Server({
  source: path.resolve(basedir, 'example/application'),
  patterns: ['**/*.js']
})
const client = new Client()

const initializers = function () {
  return new Promise((resolve, reject) => {
    server.initialize()
      .then(() => {
        return client.initialize()
      })
      .then(() => {
        client.subscribe('CreateIndividualCommand.Success')
        client.subscribe('CreateIndividualCommand.Error')
        resolve()
      })
      .catch(reject)
  })
}

const handlerSuccess = function (result) {
  client.trigger.removeListener('CreateIndividualCommand.Success', handlerSuccess)
}

const handlerError = function (result) {
  client.trigger.removeListener('CreateIndividualCommand.Error', handlerError)
}

describe('[integration] client/server tests', function () {
  it('should prepare initializations', function (done) {
    initializers().then(done).catch(done)
  })
  it('should success in client.send(action, data)', function (done) {
    client.trigger.on('CreateIndividualCommand.Success', handlerSuccess)
    client.send('CreateIndividualCommand', {email: 'client@test.com'})
      .then((result) => {
        expect(result).to.be.an('object')
        expect(result).to.have.property('uuid')
        expect(result).to.have.property('type')
        expect(result).to.have.property('name')
        expect(result).to.have.property('exectime')
        expect(result).to.have.property('result')
        expect(result.uuid).to.be.a('string')
        expect(result.type).to.be.a('string')
        expect(result.name).to.be.a('string')
        expect(result.exectime).to.be.a('number')
        done()
      })
  })
  it('should fail in client.send(action, data)', function (done) {
    client.trigger.on('CreateIndividualCommand.Error', handlerError)
    client.send('CreateIndividualCommand', {email: true})
    .then((result) => {
      expect(result).to.be.an('object')
      expect(result).to.have.property('uuid')
      expect(result).to.have.property('type')
      expect(result).to.have.property('name')
      expect(result).to.have.property('exectime')
      expect(result).to.have.property('result')
      expect(result.uuid).to.be.a('string')
      expect(result.type).to.be.a('string')
      expect(result.name).to.be.a('string')
      expect(result.exectime).to.be.a('number')
      done()
    })
    .catch(done)
  })
})
