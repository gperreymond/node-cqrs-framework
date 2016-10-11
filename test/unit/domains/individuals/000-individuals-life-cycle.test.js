/* global describe:false, it:false */
'use strict'

var Chance = require('chance')
var chance = new Chance()

const Engine = require('../../../..').Engine

const path = require('path')
const chai = require('chai')
const expect = chai.expect

let engine
let data

describe.only('[unit] individuals life cycle', function () {
  it('should initialize Engine', function (done) {
    engine = new Engine({
      bus: {
        url: require(path.resolve(__dirname, '../../../..', 'cqrs/config.json')).CQRS_RABBITMQ_URL
      },
      source: path.resolve(__dirname, '../../../..', 'cqrs')
    })
    expect(engine).to.be.an('object')
    expect(engine).to.have.property('options')
    expect(engine).to.have.property('starttime')
    expect(engine).to.have.property('uuid')
    expect(engine.options).to.be.an('object')
    expect(engine.uuid).to.be.a('string')
    expect(engine.starttime).to.be.a('number')
    done()
  })
  it('should create an individual', function (done) {
    data = {
      email: chance.email({domain: 'gmail.com'})
    }
    engine.execute('createIndividualCommand', data)
      .then(function (result) {
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
        expect(result.result).to.have.property('id')
        expect(result.result.id).to.be.a('string')
        data = result.result
        done()
      })
      .catch((error) => {
        console.log(error)
      })
  })
  it('should find some individuals', function (done) {
    let q = {
      email: data.email
    }
    engine.execute('findIndividualsQuery', q)
      .then(function (result) {
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
        expect(result.result).to.be.an('object')
        expect(result.result).to.have.property('total')
        expect(result.result.total).to.be.a('number')
        done()
      })
      .catch(done)
  })
})
