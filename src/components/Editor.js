import React, { useRef, useEffect } from 'react'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { undo, redo, history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'

const editorSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks
})

function scrapeEditorClasses () {
  return document.querySelector('div[placeholder] > div').classList.value
}

export default function Editor () {
  const elemRef = useRef(null)
  const renderRef = useRef(true)

  useEffect(() => {
    if (elemRef.current && renderRef.current) {
      const linearEditorElem = document.querySelector('form div[contenteditable="true"]')

      window.editorView = new EditorView(elemRef.current, {
        state: EditorState.create({
          doc: DOMParser.fromSchema(editorSchema).parse(linearEditorElem),
          plugins: [
            history(),
            keymap({ 'Mod-z': undo, 'Mod-y': redo }),
            keymap(baseKeymap)
          ]
        })
      })

      renderRef.current = false
    }
  }, [elemRef.current])

  return (
    <div className={scrapeEditorClasses()}>
      <div ref={elemRef} />
    </div>
  )
}
