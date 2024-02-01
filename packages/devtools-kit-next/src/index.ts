import { initDevTools } from './core/index'
import { hook } from './hook'
import { devtoolsContext, devtoolsState } from './state'
import { setupDevToolsPlugin } from './api'

export const devtools = {
  state: devtoolsState,
  context: devtoolsContext,
  hook,
  init: initDevTools,
  get api() {
    return {}
  },
}

export {
  setupDevToolsPlugin,
}
