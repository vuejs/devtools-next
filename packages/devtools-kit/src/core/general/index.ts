import { target } from '@vue-devtools-next/shared'
import { DevToolsEvents, api, callBuffer } from '../../api'
import { initComponentTree } from '../component/tree'
import { createAppRecord } from './app'
import { createDevToolsHook, subscribeDevToolsHook } from './hook'
import { devtoolsState } from './state'

// usage: inject to user application and call it before the vue app is created
export function initDevTools() {
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

  initComponentTree()

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

export {
  devtoolsState,
}
