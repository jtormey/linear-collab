import React, { useRef, useCallback, useMemo } from 'react'
import { createEditorDoc, mountEditorView, editorSchema } from '../prosemirror/Editor'
import Authority from '../prosemirror/Authority'
import SocketTransport from '../prosemirror/SocketTransport'

function scrapeEditorClasses () {
  return document.querySelector('div[placeholder] > div').classList.value
}

export default function Editor ({ issueID }) {
  const viewRef = useRef(null)
  const transport = useMemo(() => new SocketTransport('wss://collab.linear-sync.com/ws'), [])

  const setElemRef = useCallback((elem) => {
    if (viewRef.current) {
      viewRef.current.destroy()
    }

    const linearEditorElem = document.querySelector('form div[contenteditable="true"]')
    const editorDoc = createEditorDoc(linearEditorElem)
    const authority = new Authority(editorDoc, editorSchema, transport)

    authority.init()
    viewRef.current = mountEditorView(elem, authority)
  }, [])

  return (
    <div className={scrapeEditorClasses()}>
      <div ref={setElemRef} />
    </div>
  )
}
