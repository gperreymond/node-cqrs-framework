const Client = require('..').Client
const client = new Client()
client
  .subscribe('BasicNopeQuery.*', (result) => {
    console.log(result)
  })
  .start()

client.on('error', error => {
  console.log('client error')
  console.log(error)
})

client.on('ready', () => {
  console.log('client connected')
  client.send('BasicNopeQuery', {message: 'This is a query'})
})
