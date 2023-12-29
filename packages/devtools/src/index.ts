import { devtools as _devtools, addCustomCommand, addCustomTab, onDevToolsClientConnected, onDevToolsConnected, removeCustomCommand } from '@vue/devtools-kit'
import { connect } from '@vue/devtools-electron'

export type * from '@vue/devtools-kit'

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
