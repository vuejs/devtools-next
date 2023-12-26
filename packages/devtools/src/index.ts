import { devtools as _devtools, addCustomCommand, addCustomTab, onDevToolsClientConnected, onDevToolsConnected, removeCustomCommand } from '@vue-devtools-next/kit'
import { connect } from '@vue-devtools-next/electron'

export type * from '@vue-devtools-next/kit'

const devtools = {
  ..._devtools,
  connect,
}

export {
  devtools,
  onDevToolsConnected,
  onDevToolsClientConnected,
  addCustomTab,
  addCustomCommand,
  removeCustomCommand,
}
