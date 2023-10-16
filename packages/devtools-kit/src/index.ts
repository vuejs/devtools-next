import { api } from './api'
import { devtoolsContext, devtoolsState, hook, initDevTools, onDevToolsConnected } from './core/general'

export const devtools = {
  api,
  state: devtoolsState,
  context: devtoolsContext,
  init: initDevTools,
  hook,
}

export {
  onDevToolsConnected,
}
