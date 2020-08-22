import React from 'react'
import usePathState from '../hooks/usePathState'
import EditorContainer from './EditorContainer'

function isEditing (path) {
  return /^\/.*\/issue\/.*\/edit$/.test(path)
}

export default function App () {
  const path = usePathState()

  if (isEditing(path)) {
    return <EditorContainer />
  }

  return null
}
