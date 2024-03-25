import { isNuxtApp, target } from '@vue/devtools-shared'
import { createDevToolsHook, devtoolsHooks, hook, subscribeDevToolsHook } from '../hook'
import { DevToolsHooks } from '../types'
import { devtoolsAppRecords, devtoolsState, getDevToolsEnv } from '../state'
import { DevToolsEvents, DevToolsPluginApi, apiHooks, collectDevToolsPlugin, setupExternalPlugin } from '../api'
import { createAppRecord, setActiveAppRecord } from './app-record'

export function initDevTools() {
  devtoolsState.vitePluginDetected = getDevToolsEnv().vitePluginDetected

  const isDevToolsNext = target.__VUE_DEVTOOLS_GLOBAL_HOOK__?.id === 'vue-devtools-next'

  // de-duplicate
  if (target.__VUE_DEVTOOLS_GLOBAL_HOOK__ && isDevToolsNext)
    return

  if (!target.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()
  }
  else {
    // respect old devtools hook in nuxt application
    if (!isNuxtApp) {
      // override devtools hook directly
      Object.assign(__VUE_DEVTOOLS_GLOBAL_HOOK__, createDevToolsHook())
    }
  }

  // setup old devtools plugin (compatible with pinia, router, etc)
  hook.on.setupDevtoolsPlugin((pluginDescriptor, setupFn) => {
    collectDevToolsPlugin(pluginDescriptor, setupFn)
    const { app, api } = devtoolsAppRecords.active || {}
    if (!app || !api)
      return
    setupExternalPlugin([pluginDescriptor, setupFn], app, api)
  })

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
      await setActiveAppRecord(devtoolsAppRecords.value[0])
      devtoolsState.connected = true
      devtoolsHooks.callHook(DevToolsHooks.APP_CONNECTED)
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

    apiHooks.hook(DevToolsEvents.DEVTOOLS_CONNECTED_UPDATED, (state) => {
      if (state.connected) {
        fn()
        resolve()
      }
    })
  })
}

export function onDevToolsClientConnected(fn: () => void) {
  return new Promise<void>((resolve) => {
    if (devtoolsState.connected && devtoolsState.clientConnected) {
      fn()
      resolve()
      return
    }

    apiHooks.hook(DevToolsEvents.DEVTOOLS_CONNECTED_UPDATED, (state) => {
      if (state.connected && state.clientConnected) {
        fn()
        resolve()
      }
    })
  })
}
