import { Step } from 'prosemirror-transform'

/**
 * A ProseMirror authority that enables collab-mode across browser tabs.
 */

export default class ExtensionAuthority {
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
    chrome.runtime.onMessage.addListener(this.handleUpdate.bind(this))
    chrome.runtime.sendMessage({ type: 'register', issueID: this.issueID })
  }

  receiveSteps (version, steps, clientID) {
    if (version !== this.steps.length) return

    chrome.runtime.sendMessage({
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

    chrome.runtime.sendMessage({
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
