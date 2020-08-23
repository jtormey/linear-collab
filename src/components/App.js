import React from 'react'
import usePathState from '../hooks/usePathState'
import EditorContainer from './EditorContainer'

function isEditing (path) {
  return /^\/.*\/issue\/.*\/edit$/.test(path)
}

function parseIssueID (path) {
  const result = path.match(/^\/.*\/issue\/(.*)\/edit$/)[1]

  if (!result) {
    throw new Error(`Unable to parse issueID from path: ${path}`)
  }

  return result
}

export default function App () {
  const path = usePathState()

  if (isEditing(path)) {
    return <EditorContainer issueID={parseIssueID(path)} />
  }

  return null
}
