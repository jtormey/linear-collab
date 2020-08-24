/**
 * A custom transport for ProseMirror collab across browser tabs.
 */

export default class ExtensionTransport {
  init (onMessage) {
    chrome.runtime.onMessage.addListener(onMessage)
    return Promise.resolve()
  }

  send (message) {
    chrome.runtime.sendMessage(message)
  }
}
