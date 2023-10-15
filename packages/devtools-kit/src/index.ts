import { api } from './api'
import { devtoolsState, initDevTools, onDevToolsConnected } from './core/general'

export const devtools = {
  api,
  state: devtoolsState,
  init: initDevTools,
}

export {
  onDevToolsConnected,
}
