const path = require('path')

const Server = require('..').Server
const server = new Server()

server
  .use(path.resolve(__dirname, '../test/data/commands/*.js'))
  .use(path.resolve(__dirname, '../test/data/queries/*.js'))
  .start()

server.on('error', error => {
  console.log('server error')
  console.log(error)
})

server.on('ready', () => {
  console.log('server connected')
})
