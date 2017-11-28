const Client = require('..').Client

const client = new Client()

client
  .subscribe('BasicNopeQuery.Success', (result) => {
    console.log('success:', result)
  })
  .start()

client.on('error', error => {
  console.log('client error')
  console.log(error)
})

client.on('ready', () => {
  console.log('client connected')
})
