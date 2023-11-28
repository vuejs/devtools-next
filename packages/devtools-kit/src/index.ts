import { devtoolsContext, devtoolsState, hook, initDevTools, onDevToolsConnected } from './core/general'

export type * from './core/component/types'
export type * from './core/timeline/types'
export type * from './core/router'
export type * from './core/open-in-editor'
export type * from './core/vue-inspector'
export type * from './core/client/types'

export const devtools = {
  state: devtoolsState,
  context: devtoolsContext,
  init: initDevTools,
  hook,
}

export {
  onDevToolsConnected,
}
