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
  }

  init () {
    chrome.runtime.onMessage.addListener(this.handleUpdate.bind(this))
    chrome.runtime.sendMessage({ type: 'register', issueID: this.issueID })
  }

  receiveSteps (version, steps, clientID) {
    if (version !== this.steps.length) return

    chrome.runtime.sendMessage({
      type: 'steps',
      issueID: this.issueID,
      payload: {
        version,
        steps: steps.map(s => s.toJSON()),
        clientID
      }
    })
  }

  handleUpdate ({ steps, version, clientID }) {
    steps.forEach(step => {
      step = Step.fromJSON(this.schema, step)
      this.doc = step.apply(this.doc).doc
      this.steps.push(step)
      this.stepClientIDs.push(clientID)
    })

    this.onNewSteps.forEach((f) => f())
  }

  stepsSince (version) {
    return {
      steps: this.steps.slice(version),
      clientIDs: this.stepClientIDs.slice(version)
    }
  }
}
