import { isNuxtApp, target } from '@vue/devtools-shared'
import { onLegacyDevToolsPluginApiAvailable } from '../compat'
import {
  activeAppRecord,
  addDevToolsAppRecord,
  addDevToolsPluginToBuffer,
  devtoolsAppRecords,
  devtoolsContext,
  DevToolsMessagingHookKeys,
  devtoolsPluginBuffer,
  devtoolsState,
  getDevToolsEnv,
  removeDevToolsAppRecord,
  setActiveAppRecord,
  setActiveAppRecordId,
  updateDevToolsState,
} from '../ctx'
import { createDevToolsHook, hook, subscribeDevToolsHook } from '../hook'
import { DevToolsHooks } from '../types'
import { createAppRecord, removeAppRecordId } from './app'
import { callDevToolsPluginSetupFn, createComponentsDevToolsPlugin, registerDevToolsPlugin, removeRegisteredPluginApp, setupDevToolsPlugin } from './plugin'
import { initPluginSettings } from './plugin/plugin-settings'
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

  // @ts-expect-error skip type check
  // Vue2 app detection
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__.once('init', (Vue) => {
    console.log('%c[_____Vue DevTools v7 log_____]', 'color: red; font-bold: 700; font-size: 20px;')

    console.log('%cVue DevTools v7 detected in your Vue2 project. v7 only supports Vue3 and will not work.', 'font-bold: 700; font-size: 16px;')

    const url = 'https://chromewebstore.google.com/detail/vuejs-devtools/iaajmlceplecbljialhhkmedjlpdblhp'
    console.log(`%cThe legacy version that supports both Vue 2 and Vue 3 has been moved to %c ${url}`, 'font-size: 16px;', 'text-decoration: underline; cursor: pointer;font-size: 16px;')

    console.log('%cPlease install and enable only the legacy version for your Vue2 app.', 'font-bold: 700; font-size: 16px;')

    console.log('%c[_____Vue DevTools v7 log_____]', 'color: red; font-bold: 700; font-size: 20px;')
  })

  hook.on.setupDevtoolsPlugin((pluginDescriptor, setupFn) => {
    addDevToolsPluginToBuffer(pluginDescriptor, setupFn)
    const { app } = activeAppRecord ?? {}
    if (pluginDescriptor.settings) {
      initPluginSettings(pluginDescriptor.id, pluginDescriptor.settings)
    }
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
      registerDevToolsPlugin(normalizedAppRecord.app)
    }
    setupDevToolsPlugin(...createComponentsDevToolsPlugin(normalizedAppRecord.app))

    updateDevToolsState({
      connected: true,
    })

    target.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps.push(app)
  })

  hook.on.vueAppUnmount(async (app) => {
    const activeRecords = devtoolsAppRecords.value.filter(appRecord => appRecord.app !== app)

    if (activeRecords.length === 0) {
      updateDevToolsState({
        connected: false,
      })
    }

    removeDevToolsAppRecord(app)

    removeAppRecordId(app)

    if (activeAppRecord.value.app === app) {
      setActiveAppRecord(activeRecords[0])
      devtoolsContext.hooks.callHook(DevToolsMessagingHookKeys.SEND_ACTIVE_APP_UNMOUNTED_TO_CLIENT)
    }
    target.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps.splice(target.__VUE_DEVTOOLS_GLOBAL_HOOK__.apps.indexOf(app), 1)
    removeRegisteredPluginApp(app)
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
