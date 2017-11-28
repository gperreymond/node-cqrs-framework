const Client = require('..').Client
const client = new Client()
client.start()

client.on('error', error => {
  console.log('client error')
  console.log(error)
})

client.on('ready', () => {
  console.log('client connected')
  client.send('BasicNopeCommand', {email: 'theo@gmail.com'})
})
