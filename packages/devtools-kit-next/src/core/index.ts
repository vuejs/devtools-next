import { target } from '@vue/devtools-shared'
import { createDevToolsHook, devtoolsHooks, hook, subscribeDevToolsHook } from '../hook'
import { DevToolsHooks } from '../types'
import { createAppRecord, devtoolsAppRecords, devtoolsState, setActiveAppRecord } from '../state'
import { DevToolsPluginApi, collectDevToolsPlugin } from '../api'

export function initDevTools() {
  // @TODO

  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()

  // setup old devtools plugin (compatible with pinia, router, etc)
  hook.on.setupDevtoolsPlugin(collectDevToolsPlugin)

  // create app record
  hook.on.vueAppInit(async (app, version) => {
    const record = createAppRecord(app)
    const api = new DevToolsPluginApi()
    devtoolsAppRecords.value = [
      ...devtoolsAppRecords.value,
      {
        ...record,
        app,
        version,
        api,
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
