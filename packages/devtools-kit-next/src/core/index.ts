import { target } from '@vue/devtools-shared'
import { createDevToolsHook, hook } from '../hook'

export function initDevTools() {
  console.log('init')
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()
  hook.on.vueAppInit((app, version) => {
    console.log('!@')
  })
}
