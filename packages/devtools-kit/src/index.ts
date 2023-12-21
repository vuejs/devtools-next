import { devtoolsContext, devtoolsState, hook, initDevTools, onDevToolsConnected } from './core/general'
import { addCustomTab } from './core/custom-tab'
import { addCustomAction } from './core/custom-action'
import { setupDevToolsPlugin } from './api/plugin'

export type * from './core/component/types'
export type * from './core/timeline/types'
export type * from './core/router'
export type * from './core/open-in-editor'
export type * from './core/vue-inspector'
export type * from './core/component-inspector/types'
export type * from './core/custom-tab/types'
export type * from './core/custom-action'

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
  onDevToolsConnected,
  addCustomTab,
  addCustomAction,
  setupDevToolsPlugin,
}
