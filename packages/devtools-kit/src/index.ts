import { devtoolsContext, devtoolsState, hook, initDevTools, onDevToolsClientConnected, onDevToolsConnected } from './core/general'
import { addCustomTab } from './core/custom-tab'
import { addCustomCommand, removeCustomCommand } from './core/custom-command'
import { setupDevToolsPlugin } from './api/plugin'

export type * from './core/component/types'
export type * from './core/timeline/types'
export type * from './core/router'
export type * from './core/open-in-editor'
export type * from './core/vue-inspector'
export type * from './core/component-inspector/types'
export type * from './core/custom-tab/types'
export type * from './core/custom-command'

export * from './shared'

export const devtools = {
  state: devtoolsState,
  context: devtoolsContext,
  init: initDevTools,
  hook,
  get api() {
    return devtoolsContext.api
  },
}

export {
  onDevToolsClientConnected,
  onDevToolsConnected,
  addCustomTab,
  addCustomCommand,
  removeCustomCommand,
  setupDevToolsPlugin,
}
