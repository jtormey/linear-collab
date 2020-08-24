import { Step } from 'prosemirror-transform'

/**
 * A ProseMirror authority that enables collab-mode via websocket.
 */

export default class SocketAuthority {
  constructor (doc, schema, issueID) {
    this.doc = doc
    this.schema = schema
    this.issueID = issueID
    this.steps = []
    this.stepClientIDs = []
    this.onNewSteps = []
    this.cursorPos = null
    this.onCursorChange = []
  }

  init () {
    return new Promise((resolve) => {
      this.socket = new window.WebSocket('ws://localhost:8080/ws')
      this.socket.onopen = () => resolve()
      this.socket.onclose = () => setTimeout(() => this.init(), 500)
      this.socket.onmessage = (event) => this.handleUpdate(JSON.parse(event.data))
    }).then(() => {
      this.send({ type: 'register', issueID: this.issueID })
    })
  }

  receiveSteps (version, steps, clientID) {
    if (version !== this.steps.length) return

    this.send({
      type: 'steps-receive',
      issueID: this.issueID,
      payload: {
        version,
        steps: steps.map(s => s.toJSON()),
        clientID
      }
    })
  }

  receiveCursor (sendable) {
    if (sendable.data.pos === this.cursorPos) return

    this.cursorPos = sendable.data.pos

    this.send({
      type: 'cursor-receive',
      issueID: this.issueID,
      payload: { [sendable.id]: sendable.data }
    })
  }

  send (data) {
    if (this.socket.readyState === window.WebSocket.OPENING) {
      this.socket.onopen = () => this.send(data)
    } else if (this.socket.readyState === window.WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data))
    }
  }

  handleUpdate (action) {
    if (action.type === 'steps-reply') {
      const { steps, clientID } = action

      steps.forEach(step => {
        step = Step.fromJSON(this.schema, step)
        this.doc = step.apply(this.doc).doc
        this.steps.push(step)
        this.stepClientIDs.push(clientID)
      })

      this.onNewSteps.forEach((f) => f())
    }

    if (action.type === 'cursor-reply') {
      this.onCursorChange.forEach((f) => f(action))
    }
  }

  stepsSince (version) {
    return {
      steps: this.steps.slice(version),
      clientIDs: this.stepClientIDs.slice(version)
    }
  }
}
