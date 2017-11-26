const Client = require('..').Client

const client = new Client()

client
  .initialize()
  .then(() => {
    console.log('cient initialize success')
    client.__bus.publish('BasicNopeCommand', {command: true})
    client.__bus.publish('BasicNopeQuery', {query: true})
  }).catch(error => {
    console.log(error)
    process.exit(1)
  })
