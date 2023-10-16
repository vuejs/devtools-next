import { devtoolsContext, devtoolsState, hook, initDevTools, onDevToolsConnected } from './core/general'

export const devtools = {
  state: devtoolsState,
  context: devtoolsContext,
  init: initDevTools,
  hook,
}

export {
  onDevToolsConnected,
}
