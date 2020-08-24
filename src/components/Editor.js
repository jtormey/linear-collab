import React, { useRef, useEffect } from 'react'
import { createEditorDoc, mountEditorView, editorSchema } from '../prosemirror/Editor'
import ExtensionAuthority from '../prosemirror/ExtensionAuthority'

function scrapeEditorClasses () {
  return document.querySelector('div[placeholder] > div').classList.value
}

export default function Editor ({ issueID }) {
  const elemRef = useRef(null)

  useEffect(() => {
    if (elemRef.current) {
      const linearEditorElem = document.querySelector('form div[contenteditable="true"]')
      const editorDoc = createEditorDoc(linearEditorElem)
      const authority = new ExtensionAuthority(editorDoc, editorSchema, issueID)

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
