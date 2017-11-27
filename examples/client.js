const Client = require('..').Client

const client = new Client()

client
  .listen()
  .ready(error => {
    if (error) {
      console.log('cient error')
      console.log(error)
      process.exit(1)
    }
    console.log('cient ready')
    client.close()
  })

/* client
  .subscribe('*.Success', (result) => {
    console.log(result)
  })
  .initialize()
  .then(() => {
    console.log('cient initialize success')
    client.publish('BasicNopeCommand', {command: true})
    client.publish('BasicNopeQuery', {query: true})
  }).catch(error => {
    console.log(error)
    process.exit(1)
  }) */
