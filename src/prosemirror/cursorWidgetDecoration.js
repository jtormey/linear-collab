import { Decoration } from 'prosemirror-view'

export default function cursorWidgetDecoration (position, color) {
  return Decoration.widget(position, () => {
    const elem = document.createElement('div')
    const cursor = document.createElement('div')

    elem.style.display = 'inline-block'
    elem.style.position = 'relative'
    elem.style.height = '1.25em'
    elem.style.marginBottom = '-0.25em'

    cursor.style.position = 'absolute'
    cursor.style.top = '0px'
    cursor.style.bottom = '0px'
    cursor.style.width = '2px'
    cursor.style.backgroundColor = color

    elem.appendChild(cursor)
    return elem
  })
}
