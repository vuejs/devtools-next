import { target } from '@vue-devtools-next/shared'
import { createAppRecord, createDevToolsHook, subscribeDevToolsHook } from './runtime'
import { devtoolsGlobalState } from './runtime/global-state'
import { api } from './api'

export * from './runtime'

// usage: inject to user application and call it before the vue app is created
export function initDevTools() {
  // override directly to prevent conflict with the old devtools
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()

  target.__VUE_DEVTOOLS_APP_RECORDS__ ??= []

  // create app record
  api.on.vueAppInit((app, version) => {
    const record = createAppRecord(app)
    devtoolsGlobalState.appRecords = [
      ...(devtoolsGlobalState.appRecords ?? []),
      {
        ...record,
        app,
        version,
      },
    ]

    if (devtoolsGlobalState.appRecords.length === 1) {
      // set first app as default record
      devtoolsGlobalState.activeAppRecord = record
      devtoolsGlobalState.vueAppInitialized = true
    }
  })

  subscribeDevToolsHook()
}
