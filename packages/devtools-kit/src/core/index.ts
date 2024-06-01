import { isNuxtApp, target } from '@vue/devtools-shared'
import { createDevToolsHook, hook, subscribeDevToolsHook } from '../hook'
import {
  DevToolsMessagingHookKeys,
  activeAppRecord,
  addDevToolsAppRecord,
  addDevToolsPluginToBuffer,
  devtoolsAppRecords,
  devtoolsContext,
  devtoolsPluginBuffer,
  devtoolsState,
  getDevToolsEnv,
  removeDevToolsAppRecord,
  setActiveAppRecord,
  setActiveAppRecordId,
  updateDevToolsState,
} from '../ctx'
import { onLegacyDevToolsPluginApiAvailable } from '../compat'
import { DevToolsHooks } from '../types'
import { createAppRecord } from './app'
import { callDevToolsPluginSetupFn, createComponentsDevToolsPlugin, registerDevToolsPlugin, setupDevToolsPlugin } from './plugin'
import { normalizeRouterInfo } from './router'

export function initDevTools() {
  updateDevToolsState({
    vitePluginDetected: getDevToolsEnv().vitePluginDetected,
  })

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

  hook.on.setupDevtoolsPlugin((pluginDescriptor, setupFn) => {
    addDevToolsPluginToBuffer(pluginDescriptor, setupFn)
    const { app } = activeAppRecord ?? {}

    if (!app)
      return

    callDevToolsPluginSetupFn([pluginDescriptor, setupFn], app)
  })

  onLegacyDevToolsPluginApiAvailable(() => {
    const normalizedPluginBuffer = devtoolsPluginBuffer.filter(([item]) => item.id !== 'components')
    normalizedPluginBuffer.forEach(([pluginDescriptor, setupFn]) => {
      target.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, pluginDescriptor, setupFn, { target: 'legacy' })
    })
  })

  // create app record
  hook.on.vueAppInit(async (app, version) => {
    const appRecord = createAppRecord(app)
    const normalizedAppRecord = {
      ...appRecord,
      app,
      version,
    }
    addDevToolsAppRecord(normalizedAppRecord)

    if (devtoolsAppRecords.value.length === 1) {
      setActiveAppRecord(normalizedAppRecord)
      setActiveAppRecordId(normalizedAppRecord.id)
      normalizeRouterInfo(normalizedAppRecord, activeAppRecord)
    }

    setupDevToolsPlugin(...createComponentsDevToolsPlugin(normalizedAppRecord.app))
    registerDevToolsPlugin(normalizedAppRecord.app)

    updateDevToolsState({
      connected: true,
    })
  })

  hook.on.vueAppUnmount(async (app) => {
    const activeRecords = devtoolsAppRecords.value.filter(appRecord => appRecord.app !== app)

    if (activeRecords.length === 0) {
      updateDevToolsState({
        connected: false,
      })
    }

    removeDevToolsAppRecord(app)

    if (activeAppRecord.value.app === app) {
      setActiveAppRecord(activeRecords[0])
      devtoolsContext.hooks.callHook(DevToolsMessagingHookKeys.SEND_ACTIVE_APP_UNMOUNTED_TO_CLIENT)
    }
  })

  subscribeDevToolsHook()
}

export function onDevToolsClientConnected(fn: () => void) {
  return new Promise<void>((resolve) => {
    if (devtoolsState.connected && devtoolsState.clientConnected) {
      fn()
      resolve()
      return
    }

    devtoolsContext.hooks.hook(DevToolsMessagingHookKeys.DEVTOOLS_CONNECTED_UPDATED, ({ state }) => {
      if (state.connected && state.clientConnected) {
        fn()
        resolve()
      }
    })
  })
}
