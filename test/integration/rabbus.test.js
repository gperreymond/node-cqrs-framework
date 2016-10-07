'use strict'

var util = require('util')
var Rabbus = require('rabbus')
var rabbot = require('rabbot')

// define a requester
// ------------------

function SomeRequester () {
  Rabbus.Requester.call(this, rabbot, {
    exchange: 'req-res.exchange',
    routingKey: 'req-res.key'
  })
}

util.inherits(SomeRequester, Rabbus.Requester)

// make a request
// --------------

var requester = new SomeRequester(Rabbus)
var msg = {}
requester.request(msg, function (response) {
  console.log('Hello', response.place)
})

// define a responder
// ------------------

function SomeResponder () {
  Rabbus.Responder.call(this, rabbot, {
    exchange: 'req-res.exchange',
    queue: {
      name: 'req-res.queue',
      limit: 1
    },
    routingKey: 'req-res.key'
  })
}

util.inherits(SomeResponder, Rabbus.Responder)

// handle a request and send a response
// ------------------------------------

var responder = new SomeResponder(Rabbus)
responder.handle(function (message, properties, actions, next) {
  actions.reply({
    place: 'world'
  })
})
