import { target } from '@vue/devtools-shared'
import { createDevToolsHook, subscribeDevToolsHook } from '../hook'

export function initDevTools() {
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()
  subscribeDevToolsHook()
}
