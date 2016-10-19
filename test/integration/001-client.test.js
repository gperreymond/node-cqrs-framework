/* global describe:false, it:false */
'use strict'

const Server = require('../..').Server
const Client = require('../..').Client

const path = require('path')
const chai = require('chai')
const expect = chai.expect

const basedir = path.resolve(__dirname, '../..')

describe('[integration] client/server tests', function () {
  it('should success in client.send(action, data)', function (done) {
    const server = new Server({
      source: path.resolve(basedir, 'example/application'),
      patterns: ['**/*.js']
    })
    const client = new Client()
    server.initialize()
      .then(() => {
        const message = {
          email: 'test@integration.com'
        }
        client.subscribe('CreateIndividualCommand.Success')
        client.trigger.on('CreateIndividualCommand.Success', (result) => {
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
        client.send('CreateIndividualCommand', message)
      })
  })
  it('should fail in client.send(action, data)', function (done) {
    const server = new Server({
      source: path.resolve(basedir, 'example/application'),
      patterns: ['??/??.js']
    })
    const client = new Client()
    server.initialize()
      .then(() => {
        const message = {
          email: true
        }
        client.subscribe('CreateIndividualCommand.Error')
        client.trigger.on('CreateIndividualCommand.Error', () => {
          // console.log(error)
          done()
        })
        client.send('CreateIndividualCommand', message)
      })
  })
})
