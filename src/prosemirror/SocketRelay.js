const WebSocket = require('ws')
const EventEmitter = require('events')

const pipe = (...fs) => (x) => fs.reduce((a, f) => f(a), x)
const trace = (x) => console.log(x) || x

module.exports = class SocketRelay {
  constructor () {
    this.emitter = new EventEmitter()
  }

  init (app) {
    app.ws('/ws', (conn) => this.handleConnection(conn))
  }

  handleConnection (conn) {
    conn.on('message', pipe(trace, JSON.parse, this.handleMessage.bind(this, conn)))
  }

  handleMessage (conn, action) {
    console.log('Received action:', action)

    if (action.type === 'register') {
      this.emitter.on(action.issueID + '.steps-receive', (action) => {
        this.send(conn, { type: 'steps-reply', ...action.payload })
      })

      this.emitter.on(action.issueID + '.cursor-receive', (action) => {
        this.send(conn, { type: 'cursor-reply', ...action.payload })
      })

      this.emitter.on(action.issueID + '.disconnected', (payload) => {
        this.send(conn, { type: 'cursor-disconnected', ...payload })
      })

      conn.on('close', () => {
        this.emitter.emit(action.issueID + '.disconnected', { [action.cursorID]: {} })
      })
    }

    if (action.type === 'steps-receive') {
      this.emitter.emit(action.issueID + '.steps-receive', action)
    }

    if (action.type === 'cursor-receive') {
      this.emitter.emit(action.issueID + '.cursor-receive', action)
    }
  }

  send (conn, data) {
    this.sendRaw(conn, JSON.stringify(data))
  }

  sendRaw (conn, msg) {
    if (conn.readyState === WebSocket.OPEN) {
      console.log('=>', msg)
      conn.send(msg)
    } else if (conn.readyState === WebSocket.OPENING) {
      conn.on('open', () => this.sendRaw(conn, msg))
    }
  }
}
