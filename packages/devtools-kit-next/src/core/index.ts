import { target } from '@vue/devtools-shared'
import { createDevToolsHook, devtoolsHooks, hook, subscribeDevToolsHook } from '../hook'
import { DevToolsHooks } from '../types'
import { createAppRecord, devtoolsAppRecords, devtoolsState, setActiveAppRecord } from '../state'

export function initDevTools() {
  // @TODO

  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()

  // create app record
  hook.on.vueAppInit(async (app, version) => {
    const record = createAppRecord(app)
    devtoolsAppRecords.value = [
      ...devtoolsAppRecords.value,
      {
        ...record,
        app,
        version,
      },
    ]

    if (devtoolsAppRecords.value.length === 1) {
      setActiveAppRecord(devtoolsAppRecords.value[0])
      devtoolsState.connected = true
      devtoolsHooks.callHook(DevToolsHooks.APP_CONNECTED)
    }
  })

  subscribeDevToolsHook()
}
