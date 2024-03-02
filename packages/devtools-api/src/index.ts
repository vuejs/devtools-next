export {
  onDevToolsConnected,
  onDevToolsClientConnected,
  setupDevToolsPlugin,
  // compatible with v6.x
  setupDevToolsPlugin as setupDevtoolsPlugin,
  addCustomTab,
  addCustomCommand,
  removeCustomCommand,
} from '@vue/devtools-kit'

export type {
  CustomCommand,
  CustomTab,
} from '@vue/devtools-kit'
