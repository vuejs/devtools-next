import { target } from '@vue-devtools-next/shared'
import { createAppRecord, createDevToolsHook, subscribeDevToolsHook } from './runtime'
import { devtoolsState } from './runtime/global-state'
import { DevToolsEvents, api, callBuffer } from './api'

// usage: inject to user application and call it before the vue app is created
function initDevTools() {
  // override directly to prevent conflict with the old devtools
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()

  target.__VUE_DEVTOOLS_APP_RECORDS__ ??= []

  // create app record
  api.on.vueAppInit((app, version) => {
    const record = createAppRecord(app)
    devtoolsState.appRecords = [
      ...(devtoolsState.appRecords ?? []),
      {
        ...record,
        app,
        version,
      },
    ]

    if (devtoolsState.appRecords.length === 1) {
      // set first app as default record
      devtoolsState.activeAppRecord = devtoolsState.appRecords[0]
      devtoolsState.connected = true
      // mark vue app as connected
      callBuffer(DevToolsEvents.APP_CONNECTED)
    }
  })

  subscribeDevToolsHook()
}

export function onDevToolsConnected(fn: () => void) {
  return new Promise<void>((resolve) => {
    if (devtoolsState.connected) {
      fn()
      resolve()
      return
    }

    api.on.vueAppConnected(() => {
      fn()
      resolve()
    })
  })
}

export const devtools = {
  api,
  state: devtoolsState,
  init: initDevTools,
}
