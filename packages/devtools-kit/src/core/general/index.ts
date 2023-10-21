import { target } from '@vue-devtools-next/shared'
import { DevToolsHooks } from '@vue-devtools-next/schema'
import { DevToolsPluginApi, collectRegisteredPlugin, registerPlugin } from '../../api'
import { registerComponentsDevTools } from '../plugins'
import { createAppRecord } from './app'
import { createDevToolsHook, devtoolsHooks, hook, subscribeDevToolsHook } from './hook'
import { devtoolsContext, devtoolsState } from './state'

// usage: inject to user application and call it before the vue app is created
export function initDevTools() {
  // override directly to prevent conflict with the old devtools
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()

  target.__VUE_DEVTOOLS_APP_RECORDS__ ??= []

  // devtools plugin setup hook
  hook.on.setupDevtoolsPlugin(collectRegisteredPlugin)

  // create app record
  hook.on.vueAppInit(async (app, version) => {
    const record = createAppRecord(app)
    const api = new DevToolsPluginApi()
    devtoolsState.appRecords = [
      ...(devtoolsState.appRecords ?? []),
      {
        ...record,
        app,
        version,
        api,
      },
    ]

    if (devtoolsState.appRecords.length === 1) {
      await registerComponentsDevTools(app)
      // set first app as default record
      devtoolsState.activeAppRecord = devtoolsState.appRecords[0]
      devtoolsState.connected = true
      // mark vue app as connected
      devtoolsHooks.callHook(DevToolsHooks.APP_CONNECTED)
    }
    registerPlugin({
      app,
      api,
    })
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

    hook.on.vueAppConnected(() => {
      fn()
      resolve()
    })
  })
}

export {
  devtoolsContext,
  devtoolsState,
  hook,
}
