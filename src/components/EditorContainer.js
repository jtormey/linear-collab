import React from 'react'
import useElemBoundingRect from '../hooks/useElemBoundingRect'
import Editor from './Editor'

export default function EditorContainer () {
  const rect = useElemBoundingRect('form div[contenteditable="true"]')

  if (rect) {
    const { x, y, width, height } = rect

    const style = {
      position: 'fixed',
      top: y,
      bottom: window.innerHeight - (y + height),
      left: x,
      right: window.innerWidth - (x + width),
      background: 'black',
      border: '2px solid red'
    }

    return (
      <div style={style}>
        <Editor rect={rect} />
      </div>
    )
  }

  return null
}
