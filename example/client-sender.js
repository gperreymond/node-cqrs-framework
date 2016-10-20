'use strict'

const Client = require('node-cqrs-framework').Client
const client = new Client()

const handlerSuccess = function () {
  const params = {
    a: 'a',
    b: 'b'
  }
  client.send('BasicNopeQuery', params)
    .then((result) => {
      console.log(result)
      process.exit(0)
    })
    .catch((error) => {
      console.log(error)
      process.exit(1)
    })
}

const handlerError = function (error) {
  console.log(error)
  process.exit(1)
}

client.initialize().then(handlerSuccess).catch(handlerError)
