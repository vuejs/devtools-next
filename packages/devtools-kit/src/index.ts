import { devtoolsContext, devtoolsState, hook, initDevTools, onDevToolsConnected } from './core/general'

export type * from './core/component/types'

export const devtools = {
  state: devtoolsState,
  context: devtoolsContext,
  init: initDevTools,
  hook,
}

export {
  onDevToolsConnected,
}
