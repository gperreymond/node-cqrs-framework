const Client = require('..').Client

const client = new Client()

client
  .initialize()
  .then(() => {
    console.log('cient initialize success')
  }).catch(error => {
    console.log(error)
    process.exit(1)
  })
