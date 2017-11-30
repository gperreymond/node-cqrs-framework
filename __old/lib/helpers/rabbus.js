'use strict'

const Rabbus = require('rabbus')

const util = require('util')
const _ = require('lodash')

/**
RABBUS: Requester / Responder
**/

function Requester (rabbot, name) {
  Rabbus.Requester.call(this, rabbot, {
    exchange: _.snakeCase(name).toLowerCase() + '__reqres.exchange',
    routingKey: _.snakeCase(name).toLowerCase() + '__reqres.key'
  })
}
util.inherits(Requester, Rabbus.Requester)

function Responder (rabbot, name) {
  Rabbus.Responder.call(this, rabbot, {
    exchange: _.snakeCase(name).toLowerCase() + '__reqres.exchange',
    queue: {
      name: _.snakeCase(name).toLowerCase() + '__reqres.queue',
      limit: 1
    },
    routingKey: _.snakeCase(name).toLowerCase() + '__reqres.key'
  })
}
util.inherits(Responder, Rabbus.Responder)

/**
RABBUS: Publish / Subscribe
**/

function Publisher (rabbot, name) {
  Rabbus.Publisher.call(this, rabbot, {
    exchange: _.snakeCase(name).toLowerCase() + '__pubsub.exchange',
    routingKey: _.snakeCase(name).toLowerCase() + '__pubsub.key'
  })
}
util.inherits(Publisher, Rabbus.Publisher)

function Subscriber (rabbot, name) {
  Rabbus.Subscriber.call(this, rabbot, {
    exchange: _.snakeCase(name).toLowerCase() + '__pubsub.exchange',
    queue: _.snakeCase(name).toLowerCase() + '__pubsub.queue',
    routingKey: _.snakeCase(name).toLowerCase() + '__pubsub.key'
  })
}
util.inherits(Subscriber, Rabbus.Subscriber)

/**
RABBUS: Send / Receive
**/

function Sender (rabbot, name) {
  Rabbus.Sender.call(this, rabbot, {
    exchange: _.snakeCase(name).toLowerCase() + '__senrec.exchange',
    routingKey: _.snakeCase(name).toLowerCase() + '__senrec.key'
  })
}
util.inherits(Sender, Rabbus.Sender)

function Receiver (rabbot, name) {
  Rabbus.Receiver.call(this, rabbot, {
    exchange: _.snakeCase(name).toLowerCase() + '__senrec.exchange',
    queue: _.snakeCase(name).toLowerCase() + '__senrec.queue',
    routingKey: _.snakeCase(name).toLowerCase() + '__senrec.key'
  })
}
util.inherits(Receiver, Rabbus.Receiver)

module.exports.Responder = Responder
module.exports.Requester = Requester
module.exports.Publisher = Publisher
module.exports.Subscriber = Subscriber
module.exports.Sender = Sender
module.exports.Receiver = Receiver
