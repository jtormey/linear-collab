/**
 * A custom transport for ProseMirror collab via websocket.
 */

export default class SocketTransport {
  constructor (socketUrl) {
    this.socketUrl = socketUrl
  }

  init (onMessage) {
    return new Promise((resolve) => {
      this.socket = new window.WebSocket(this.socketUrl)
      this.socket.onopen = () => resolve()
      this.socket.onclose = () => setTimeout(() => this.init(onMessage), 500)
      this.socket.onmessage = (event) => onMessage(JSON.parse(event.data))
    })
  }

  send (message) {
    if (this.socket.readyState === window.WebSocket.OPENING) {
      this.socket.onopen = () => this.send(message)
    } else if (this.socket.readyState === window.WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message))
    }
  }

  close () {
    this.socket.close()
  }
}
