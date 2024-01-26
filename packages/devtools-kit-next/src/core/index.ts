import { target } from '@vue/devtools-shared'
import { createDevToolsHook, hook, subscribeDevToolsHook } from '../hook'

export function initDevTools() {
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()
  hook.on.vueAppInit((app, version) => {
    console.log('!@')
  })
  subscribeDevToolsHook()
}
