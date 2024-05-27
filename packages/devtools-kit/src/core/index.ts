import { devtoolsState } from '../state'
import { DevToolsEvents, apiHooks } from '../api'

export function initDevTools() {
  // devtoolsState.vitePluginDetected = getDevToolsEnv().vitePluginDetected

  // const isDevToolsNext = target.__VUE_DEVTOOLS_GLOBAL_HOOK__?.id === 'vue-devtools-next'

  // // de-duplicate
  // if (target.__VUE_DEVTOOLS_GLOBAL_HOOK__ && isDevToolsNext)
  //   return

  // if (!target.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
  //   target.__VUE_DEVTOOLS_GLOBAL_HOOK__ = createDevToolsHook()
  // }
  // else {
  //   // respect old devtools hook in nuxt application
  //   if (!isNuxtApp) {
  //     // override devtools hook directly
  //     Object.assign(__VUE_DEVTOOLS_GLOBAL_HOOK__, createDevToolsHook())
  //   }
  // }

  // // setup old devtools plugin (compatible with pinia, router, etc)
  // hook.on.setupDevtoolsPlugin((pluginDescriptor, setupFn) => {
  //   collectDevToolsPlugin(pluginDescriptor, setupFn)
  //   const { app } = devtoolsAppRecords.active || {}
  //   if (!app)
  //     return
  //   setupExternalPlugin([pluginDescriptor, setupFn], app)
  // })

  // onLegacyDevToolsPluginApiAvailable(() => {
  //   const normalizedPluginBuffer = devtoolsState.pluginBuffer.filter(([item]) => item.id !== 'components')
  //   normalizedPluginBuffer.forEach(([pluginDescriptor, setupFn]) => {
  //     target.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, pluginDescriptor, setupFn, { target: 'legacy' })
  //   })
  // })

  // // create app record
  // hook.on.vueAppInit(async (app, version) => {
  //   const record = createAppRecord(app)
  //   // const api = new DevToolsPluginApi()
  //   devtoolsAppRecords.value = [
  //     ...devtoolsAppRecords.value,
  //     {
  //       ...record,
  //       app,
  //       version,
  //       // api,
  //     },
  //   ]

  //   addDevToolsAppRecord(record)

  //   if (devtoolsAppRecords.value.length === 1) {
  //     setActiveAppRecord(record)

  //     await _setActiveAppRecord(devtoolsAppRecords.value[0])
  //     devtoolsState.connected = true
  //     devtoolsHooks.callHook(DevToolsHooks.APP_CONNECTED)
  //   }
  // })

  // hook.on.vueAppUnmount(async (app) => {
  //   const activeRecords = devtoolsAppRecords.value.filter(appRecord => appRecord.app !== app)
  //   // #356 should disconnect when all apps are unmounted
  //   if (activeRecords.length === 0) {
  //     devtoolsState.connected = false
  //     return
  //   }
  //   devtoolsAppRecords.value = activeRecords
  //   if (devtoolsAppRecords.active.app === app)
  //     await _setActiveAppRecord(activeRecords[0])
  // })

  // subscribeDevToolsHook()
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
