import { Plugin, PluginKey } from 'prosemirror-state'
import { DecorationSet } from 'prosemirror-view'
import cursorWidgetDecoration from './cursorWidgetDecoration'

const key = new PluginKey('collabCursor')

const colors = [
  'orange',
  'palevioletred',
  'mediumpurple',
  'darkseagreen',
  'seashell'
]

export const randID = () => 'cursor-' + Math.random().toString(36).slice(2)
const randColor = () => colors[Math.floor(Math.random() * colors.length)]

function cursorDecorationsFromState (state) {
  if (!state.collabCursor$) {
    return []
  }

  return Object.keys(state.collabCursor$.cursors)
    .filter((cursorID) => {
      return cursorID !== state.collabCursor$.id
    })
    .map((cursorID) => {
      const { pos, color } = state.collabCursor$.cursors[cursorID]
      return cursorWidgetDecoration(pos, color)
    })
}

export function plugin (authority, cursorID) {
  return new Plugin({
    key,
    state: {
      init () {
        return {
          id: cursorID,
          color: randColor(),
          cursors: {}
        }
      },
      apply (transaction, value, oldState, newState) {
        const meta = transaction.getMeta('collabCursor')

        if (meta) {
          return {
            ...value,
            cursors: {
              ...value.cursors,
              ...meta.cursors
            }
          }
        } else {
          return value
        }
      }
    },
    appendTransaction (transactions, oldState, newState) {
      const transaction = newState.tr

      if (!oldState.collabCursor$) {
        return transaction
      }

      transaction.setMeta('collabCursor', {
        cursors: {
          [oldState.collabCursor$.id]: {
            pos: newState.selection.$head.pos,
            color: oldState.collabCursor$.color
          }
        }
      })

      return transaction
    },
    props: {
      decorations: (state) => DecorationSet.create(
        authority.doc,
        cursorDecorationsFromState(state)
      )
    }
  })
}

export function sendableData (state) {
  if (!state.collabCursor$) {
    return null
  }

  const cursorID = state.collabCursor$.id
  const cursorData = state.collabCursor$.cursors[cursorID]

  if (!cursorData) {
    return null
  }

  return { id: cursorID, data: cursorData }
}

export function receiveTransaction (state, cursorData) {
  const transaction = state.tr

  if (!state.collabCursor$) {
    return transaction
  }

  if (cursorData[state.collabCursor$.id] == null) {
    transaction.setMeta('collabCursor', { cursors: cursorData })
  }

  return transaction
}
