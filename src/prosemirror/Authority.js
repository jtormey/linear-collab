import { Step } from 'prosemirror-transform'

/**
 * A generic ProseMirror authority that enables collab-mode across a transport.
 */

export default class ExtensionAuthority {
  constructor (doc, schema, transport, issueID) {
    this.doc = doc
    this.schema = schema
    this.transport = transport
    this.issueID = issueID
    this.steps = []
    this.stepClientIDs = []
    this.onNewSteps = []
    this.cursorPos = null
    this.onCursorChange = []
  }

  init () {
    return this.transport.init(this.handleUpdate.bind(this)).then(() => {
      this.transport.send({ type: 'register', issueID: this.issueID })
    })
  }

  receiveSteps (version, steps, clientID) {
    if (version !== this.steps.length) return

    this.transport.send({
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

    this.transport.send({
      type: 'cursor-receive',
      issueID: this.issueID,
      payload: { [sendable.id]: sendable.data }
    })
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
