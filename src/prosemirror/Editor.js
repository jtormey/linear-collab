import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { undo, redo, history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { baseKeymap } from 'prosemirror-commands'
import * as collab from 'prosemirror-collab'
import * as collabCursor from './collabCursor'

export const editorSchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks
})

export function createEditorDoc (targetElem) {
  return DOMParser.fromSchema(editorSchema).parse(targetElem)
}

export function mountEditorView (mountElem, authority, cursorID) {
  const view = new EditorView(mountElem, {
    state: EditorState.create({
      doc: authority.doc,
      plugins: [
        history(),
        keymap({ 'Mod-z': undo, 'Mod-y': redo }),
        keymap(baseKeymap),
        keymap({ 'Mod-Enter': () => window.history.back() }),
        collab.collab({ version: authority.steps.length }),
        collabCursor.plugin(authority, cursorID)
      ]
    }),
    dispatchTransaction (transaction) {
      const newState = view.state.apply(transaction)

      view.updateState(newState)

      const sendable = collab.sendableSteps(newState)

      if (sendable) {
        authority.receiveSteps(sendable.version, sendable.steps, sendable.clientID)
      }

      const cursorSendable = collabCursor.sendableData(newState)

      if (cursorSendable) {
        authority.receiveCursor(cursorSendable)
      }
    }
  })

  authority.onNewSteps.push(() => {
    const newData = authority.stepsSince(collab.getVersion(view.state))
    view.dispatch(collab.receiveTransaction(view.state, newData.steps, newData.clientIDs))
  })

  authority.onCursorChange.push((cursorData) => {
    view.dispatch(collabCursor.receiveTransaction(view.state, cursorData))
  })

  return view
}
