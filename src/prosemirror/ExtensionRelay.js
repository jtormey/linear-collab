export default class ExtensionRelay {
  constructor () {
    this.tabs = new Set()
    this.tabsIssuesMapping = {}
  }

  init () {
    chrome.runtime.onMessage.addListener(this.handleMessage.bind(this))
  }

  handleMessage (action, sender) {
    console.log('Received action:', action, this.tabs, this.tabsIssuesMapping)

    if (action.type === 'register') {
      this.tabs.add(sender.tab.id)
      this.tabsIssuesMapping[sender.tab.id] = action.issueID
    }

    if (action.type === 'steps') {
      this.tabs.forEach((tid) => {
        if (this.tabsIssuesMapping[tid] === action.issueID) {
          chrome.tabs.sendMessage(tid, action.payload)
        }
      })
    }
  }
}
