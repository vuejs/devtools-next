import { target } from '@vue-devtools-next/shared'
import { createAppRecord, createDevToolsHook, onVueAppInit, subscribeDevToolsHook } from './runtime'

export { createDevToolsHook, subscribeDevToolsHook, onVueAppInit } from './runtime'

// usage: inject to user application and call it before the vue app is created
export function initDevTools() {
  // override directly to prevent conflict with the old devtools
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()

  target.__VUE_DEVTOOLS_APP_RECORDS__ ??= []

  // create app record
  onVueAppInit((app, version) => {
    const record = createAppRecord(app)
    target.__VUE_DEVTOOLS_APP_RECORDS__.push({
      ...record,
      app,
      version,
    })

    if (target.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER__.length === 1) {
      // set default app record
      target.__VUE_DEVTOOLS_ACTIVE_APP_RECORD__ = record
    }
  })

  subscribeDevToolsHook()
}
