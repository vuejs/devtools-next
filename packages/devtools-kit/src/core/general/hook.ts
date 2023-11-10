import type { DevtoolsHook, PluginDescriptor, PluginSetupFunction, VueAppInstance } from '@vue-devtools-next/schema'
import { DevToolsHooks } from '@vue-devtools-next/schema'
import { target } from '@vue-devtools-next/shared'
import type { HookKeys, Hookable } from 'hookable'
import { createHooks } from 'hookable'
import type { App } from 'vue'

type HookAppInstance = App & VueAppInstance
interface DevToolsEvent {
  [DevToolsHooks.APP_INIT]: (app: VueAppInstance['appContext']['app'], version: string) => void
  [DevToolsHooks.APP_CONNECTED]: () => void
  [DevToolsHooks.COMPONENT_ADDED]: (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => void
  [DevToolsHooks.COMPONENT_UPDATED]: DevToolsEvent['component:added']
  [DevToolsHooks.COMPONENT_REMOVED]: DevToolsEvent['component:added']
  [DevToolsHooks.SETUP_DEVTOOLS_PLUGIN]: (pluginDescriptor: PluginDescriptor, setupFn: PluginSetupFunction) => void
}

export const devtoolsHooks: Hookable<DevToolsEvent, HookKeys<DevToolsEvent>> = target.__VUE_DEVTOOLS_HOOK ??= createHooks<DevToolsEvent>()

const on = {
  vueAppInit(fn: DevToolsEvent[DevToolsHooks.APP_INIT]) {
    devtoolsHooks.hook(DevToolsHooks.APP_INIT, fn)
  },
  vueAppConnected(fn: DevToolsEvent[DevToolsHooks.APP_CONNECTED]) {
    devtoolsHooks.hook(DevToolsHooks.APP_CONNECTED, fn)
  },
  componentAdded(fn: DevToolsEvent[DevToolsHooks.COMPONENT_ADDED]) {
    devtoolsHooks.hook(DevToolsHooks.COMPONENT_ADDED, fn)
  },
  componentUpdated(fn: DevToolsEvent[DevToolsHooks.COMPONENT_UPDATED]) {
    devtoolsHooks.hook(DevToolsHooks.COMPONENT_UPDATED, fn)
  },
  componentRemoved(fn: DevToolsEvent[DevToolsHooks.COMPONENT_REMOVED]) {
    devtoolsHooks.hook(DevToolsHooks.COMPONENT_REMOVED, fn)
  },
  setupDevtoolsPlugin(fn: DevToolsEvent[DevToolsHooks.SETUP_DEVTOOLS_PLUGIN]) {
    devtoolsHooks.hook(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, fn)
  },
}

export function createDevToolsHook(): DevtoolsHook {
  return {
    enabled: false,
    appRecords: [],
    apps: {},
    events: new Map(),
    on(event, fn) {
      if (!this.events.has(event))
        this.events.set(event, [])

      this.events.get(event)?.push(fn)
      // cleanup function
      return () => this.off(event, fn)
    },
    once(event, fn) {
      const onceFn = (...args) => {
        this.off(event, onceFn)
        fn(...args)
      }

      this.on(event, onceFn)
      return [event, onceFn] as const
    },
    off(event, fn) {
      if (this.events.has(event)) {
        const eventCallbacks = this.events.get(event)!
        const index = eventCallbacks.indexOf(fn)
        if (index !== -1)
          eventCallbacks.splice(index, 1)
      }
    },
    emit(event, ...payload) {
      if (this.events.has(event))
        this.events.get(event)!.forEach(fn => fn(...payload))
    },
  }
}

export function subscribeDevToolsHook() {
  const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__
  // app init hook
  hook.on(DevToolsHooks.APP_INIT, (app: VueAppInstance['appContext']['app'], version: string) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    devtoolsHooks.callHook(DevToolsHooks.APP_INIT, app, version)
    // const record = createAppRecord(app)

    // hook.appRecords.push({
    //   ...record,
    //   app,
    //   version,
    // })
  })

  // component added hook
  hook.on(DevToolsHooks.COMPONENT_ADDED, async (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    devtoolsHooks.callHook(DevToolsHooks.COMPONENT_ADDED, app, uid, parentUid, component)
  })

  // component updated hook
  hook.on(DevToolsHooks.COMPONENT_UPDATED, (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    devtoolsHooks.callHook(DevToolsHooks.COMPONENT_UPDATED, app, uid, parentUid, component)
  })

  // component removed hook
  hook.on(DevToolsHooks.COMPONENT_REMOVED, async (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    devtoolsHooks.callHook(DevToolsHooks.COMPONENT_REMOVED, app, uid, parentUid, component)
  })

  // devtools plugin setup
  hook.on(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, (pluginDescriptor: PluginDescriptor, setupFn: PluginSetupFunction) => {
    devtoolsHooks.callHook(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, pluginDescriptor, setupFn)
  })
}

export const hook = {
  on,
}
