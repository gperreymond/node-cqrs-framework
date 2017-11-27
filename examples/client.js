const Client = require('..').Client

const client = new Client()

client
  .subscribe('*.Success', (result) => {
    console.log(result)
  })
  .listen()

client.on('error', error => {
  console.log('client error')
  console.log(error)
})

client.on('ready', () => {
  console.log('client connected')
  client.publish('BasicNopeQuery', {data: true})
})
