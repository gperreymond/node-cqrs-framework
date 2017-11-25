const path = require('path')
const Server = require('..').Server

const server = new Server({
  source: path.resolve(__dirname, '../test'),
  patterns: ['data/commands/*.js', 'data/queries/*.js']
})

server.initialize().then(() => {
  console.log('server initialize success')
}).catch(error => {
  console.log(error)
  process.exit(1)
})
