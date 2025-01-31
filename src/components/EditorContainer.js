import React from 'react'
import styled from 'styled-components'
import useElemBoundingRect from '../hooks/useElemBoundingRect'
import useCollabState from '../hooks/useCollabState'
import Editor from './Editor'

const EditorContainerStyle = styled.div`
  position: fixed;
  top: ${props => props.rect.y}px;
  bottom: ${props => window.innerHeight - (props.rect.y + props.rect.height)}px;
  left: ${props => props.rect.x}px;
  right: ${props => window.innerWidth - (props.rect.x + props.rect.width)}px;
  display: ${props => props.shouldDisplay ? 'block' : 'none'};
  background-color: rgb(31, 32, 35);
  overflow: scroll;
`

export default function EditorContainer ({ issueID }) {
  const rect = useElemBoundingRect('form div[contenteditable="true"]')
  const [enabled] = useCollabState()

  if (rect) {
    return (
      <EditorContainerStyle shouldDisplay={enabled} rect={rect}>
        <Editor issueID={issueID} />
      </EditorContainerStyle>
    )
  }

  return null
}
