import { initDevTools } from './core/index'
import { hook } from './hook'
import { devtoolsState } from './state'

export const devtools = {
  state: devtoolsState,
  hook,
  init: initDevTools,
  get api() {
    return {}
  },
}
