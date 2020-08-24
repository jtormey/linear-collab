const http = require('http')
const express = require('express')
const expressWs = require('express-ws')
const SocketRelay = require('./prosemirror/SocketRelay')

const PORT = process.env.PORT || 8080

class AppServer {
  constructor (db, { cert, key } = {}) {
    this.socketRelay = new SocketRelay()
  }

  setupRoutes (app) {
    this.socketRelay.init(app)
    app.use((req, res) => res.status(404).json({ error: 'not_found' }))
  }

  listen (port, callback) {
    const app = express()
    const server = http.createServer(app)
    expressWs(app, server)

    this.setupRoutes(app)

    server.listen(port, () => {
      callback && callback()
    })
  }
}

const app = new AppServer()

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`)
})
