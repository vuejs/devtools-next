import { target } from '@vue/devtools-shared'

// devtools <= 6.x
export function isLegacyVueDevTools() {
  return +(target.__VUE_DEVTOOLS_GLOBAL_HOOK__.devtoolsVersion?.[0] ?? 0) < 7
}

export function onLegacyDevToolsPluginApiAvailable(cb: () => void) {
  if (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__) {
    cb()
    return
  }
  // eslint-disable-next-line accessor-pairs
  Object.defineProperty(target, '__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__', {
    set(value) {
      if (value)
        cb()
    },
    configurable: true,
  })
}
