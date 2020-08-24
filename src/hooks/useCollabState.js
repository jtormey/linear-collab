import { useState, useEffect } from 'react'

const COLLAB_ENABLED_KEY = 'collab.enabled'

export default function useCollabState () {
  const [state, setState] = useState(false)

  function initState (result) {
    if (result[COLLAB_ENABLED_KEY] != null) {
      setState(result[COLLAB_ENABLED_KEY])
    }
  }

  function changeState (value) {
    chrome.storage.local.set({ [COLLAB_ENABLED_KEY]: value }, () => {
      setState(value)
    })
  }

  function handleChange (changes) {
    if (changes[COLLAB_ENABLED_KEY] != null) {
      setState(changes[COLLAB_ENABLED_KEY].newValue)
    }
  }

  useEffect(() => {
    chrome.storage.local.get([COLLAB_ENABLED_KEY], initState)
    chrome.storage.local.onChanged.addListener(handleChange)

    return () => {
      chrome.storage.local.onChanged.removeListener(handleChange)
    }
  }, [])

  return [state, changeState]
}
