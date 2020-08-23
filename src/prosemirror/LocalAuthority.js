/**
 * Simple-context authority,
 * copied from https://prosemirror.net/docs/guide/#collab
 */

export default class LocalAuthority {
  constructor (doc) {
    this.doc = doc
    this.steps = []
    this.stepClientIDs = []
    this.onNewSteps = []
  }

  receiveSteps (version, steps, clientID) {
    if (version !== this.steps.length) return

    steps.forEach(step => {
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
