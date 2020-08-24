import React, { useRef, useEffect } from 'react'
import { createEditorDoc, mountEditorView, editorSchema } from '../prosemirror/Editor'
import Authority from '../prosemirror/Authority'
import SocketTransport from '../prosemirror/SocketTransport'

function scrapeEditorClasses () {
  return document.querySelector('div[placeholder] > div').classList.value
}

export default function Editor ({ issueID }) {
  const elemRef = useRef(null)

  useEffect(() => {
    if (elemRef.current) {
      const linearEditorElem = document.querySelector('form div[contenteditable="true"]')
      const editorDoc = createEditorDoc(linearEditorElem)
      const transport = new SocketTransport('wss://collab.linear-sync.com/ws')
      // const transport = new SocketTransport('ws://localhost:8080/ws')
      const authority = new Authority(editorDoc, editorSchema, transport)

      authority.init()
      const view = mountEditorView(elemRef.current, authority)

      return () => {
        view.destroy()
      }
    }
  }, [elemRef.current])

  return (
    <div className={scrapeEditorClasses()}>
      <div ref={elemRef} />
    </div>
  )
}
