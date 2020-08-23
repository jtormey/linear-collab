import React, { useState } from 'react'
import styled from 'styled-components'
import useElemBoundingRect from '../hooks/useElemBoundingRect'
import Editor from './Editor'

const EditorContainerStyle = styled.div`
  position: fixed;
  top: ${props => props.rect.y}px;
  bottom: ${props => window.innerHeight - (props.rect.y + props.rect.height)}px;
  left: ${props => props.rect.x}px;
  right: ${props => window.innerWidth - (props.rect.x + props.rect.width)}px;
  display: ${props => props.shouldDisplay ? 'block' : 'none'};
  background-color: rgb(31, 32, 35);
`

export default function EditorContainer () {
  const rect = useElemBoundingRect('form div[contenteditable="true"]')
  const [display, setDisplay] = useState(true)

  window.setDisplay = setDisplay

  if (rect) {
    return (
      <EditorContainerStyle shouldDisplay={display} rect={rect}>
        <Editor rect={rect} />
      </EditorContainerStyle>
    )
  }

  return null
}
