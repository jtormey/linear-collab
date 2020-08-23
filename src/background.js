import '@manifest'
import ExtensionRelay from './prosemirror/ExtensionRelay'

const relay = new ExtensionRelay()
relay.init()

console.log('[background loaded]')
