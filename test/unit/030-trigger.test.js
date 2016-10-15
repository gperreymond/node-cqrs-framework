/* global describe:false, it:false */
'use strict'

const Trigger = require('../..').Trigger

const chai = require('chai')
const expect = chai.expect

const engineMock = {
  bus: {
    subscribe (name, callback) {
      callback()
    }
  },
  execute (name, params) {

  }
}

describe('[unit] class trigger', function () {
  it('should create a new Trigger', function (done) {
    let trigger = new Trigger('TestUnitTrigger')
    expect(trigger).to.be.an('object')
    expect(trigger).to.have.property('uuid')
    expect(trigger).to.have.property('type')
    expect(trigger).to.have.property('name')
    expect(trigger.uuid).to.be.a('string')
    expect(trigger.type).to.be.equal('Trigger')
    expect(trigger.name).to.be.a('string')
    done()
  })
  it('should bind and subscribe a mocked engine', function (done) {
    let trigger = new Trigger('TestUnitTrigger')
    trigger.bind(engineMock)
    engineMock.bus.subscribe('TestUnitTrigger', () => {
      expect(trigger).to.be.an('object')
      expect(trigger).to.have.property('engine')
      expect(trigger).to.have.property('type')
      expect(trigger).to.have.property('name')
      expect(trigger.uuid).to.be.a('string')
      expect(trigger.type).to.be.equal('Trigger')
      expect(trigger.name).to.be.a('string')
      done()
    })
  })
})
