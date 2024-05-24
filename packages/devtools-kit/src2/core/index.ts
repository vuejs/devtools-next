import { isNuxtApp, target } from '@vue/devtools-shared'
import { createDevToolsHook, hook, subscribeDevToolsHook } from '../hook'
import {
  activeAppRecord,
  addDevToolsAppRecord,
  addDevToolsPluginToBuffer,
  devtoolsAppRecords,
  setActiveAppRecord,
  setActiveAppRecordId,
} from '../ctx'
import { createAppRecord } from './app'
import { callDevToolsPluginSetupFn, createComponentsDevToolsPlugin, registerDevToolsPlugin, setupDevToolsPlugin } from './plugin'

export function initDevTools() {
  // @TODO: 1. vitePluginDetected

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

  // @TODO: onLegacyDevToolsPluginApiAvailable handler

  // create app record
  hook.on.vueAppInit(async (app, version) => {
    const appRecord = createAppRecord(app)
    const normalizedAppRecord = {
      ...appRecord,
      app,
      version,
    }
    addDevToolsAppRecord(normalizedAppRecord)

    if (devtoolsAppRecords.length === 1) {
      setActiveAppRecord(normalizedAppRecord)
      setActiveAppRecordId(normalizedAppRecord.id)
    }

    // @TODO: register plugin
    setupDevToolsPlugin(...createComponentsDevToolsPlugin(normalizedAppRecord.app))
    registerDevToolsPlugin(normalizedAppRecord.app)

    // @TODO: call app connected

    // console.log('?', appRecord)
  })

  // ...
  console.log('init devtools')
  subscribeDevToolsHook()
}
