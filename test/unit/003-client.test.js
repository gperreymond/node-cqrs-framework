'use strict'

const Client = require('../..').Client
const Rabbus = require('../../lib/helpers/rabbus')

const sinon = require('sinon')
const chai = require('chai')
const expect = chai.expect

const RabbotMock = require('../mocks/Rabbot')
const rabbotMock = new RabbotMock()

const successMockCommandHandler = () => {
}

const client = new Client({
  rabbot: rabbotMock,
  port: 6666
})

describe('[unit] class server', function () {
  it('should initialize', function (done) {
    client
      .subscribe('BasicMockCommand.Success', successMockCommandHandler)
      .initialize()
      .then(() => {
        expect(client).to.be.an('object')
        expect(client.uuid).to.be.a('string')
        done()
      })
      .catch(done)
  })
  it('should successfully use send', function (done) {
    var stub = sinon.stub(Rabbus, 'Sender', (rabbot, name) => {
      return {
        send (params, acknowledgement) {
          acknowledgement()
        }
      }
    })
    client.send('BasicMockCommand', {}, (acknowledgement) => {
      expect(acknowledgement).to.be.an('object')
      expect(acknowledgement.type).to.be.eq('Send.Acknowledgement')
      expect(acknowledgement.service).to.be.eq('BasicMockCommand')
      stub.restore()
      done()
    })
  })
})
