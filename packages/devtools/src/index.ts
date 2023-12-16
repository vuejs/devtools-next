import { devtools as _devtools, addCustomTab, onDevToolsConnected } from 'vue-devtools-kit'
import { connect } from '@vue-devtools-next/electron'

export type * from 'vue-devtools-kit'

const devtools = {
  ..._devtools,
  connect,
}

export {
  devtools,
  onDevToolsConnected,
  addCustomTab,
}
