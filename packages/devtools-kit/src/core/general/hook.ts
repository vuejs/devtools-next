import type { DevtoolsHook, PluginDescriptor, PluginSetupFunction, VueAppInstance } from '@vue-devtools-next/schema'
import { DevToolsHooks } from '@vue-devtools-next/schema'
import { target } from '@vue-devtools-next/shared'
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

const devtoolsHookEventsBuffer: {
  [P in DevToolsHooks]: Array<DevToolsEvent[keyof DevToolsEvent]>
} = target.__VUE_DEVTOOLS_HOOK_EVENT_BUFFER__ ??= {
  [DevToolsHooks.APP_INIT]: [],
  [DevToolsHooks.APP_CONNECTED]: [],
  [DevToolsHooks.COMPONENT_ADDED]: [],
  [DevToolsHooks.COMPONENT_UPDATED]: [],
  [DevToolsHooks.COMPONENT_REMOVED]: [],
  [DevToolsHooks.SETUP_DEVTOOLS_PLUGIN]: [],
}

function collectBuffer<T extends keyof DevToolsEvent>(event: T, fn: DevToolsEvent[T]) {
  devtoolsHookEventsBuffer[event].push(fn)
}

function callBuffer<T extends keyof DevToolsEvent>(eventName: T, ...args: Parameters<DevToolsEvent[T]>) {
  // @ts-expect-error tuple rest
  devtoolsHookEventsBuffer[eventName].forEach(fn => fn(...args))
}

const on = {
  vueAppInit(fn: DevToolsEvent[DevToolsHooks.APP_INIT]) {
    collectBuffer(DevToolsHooks.APP_INIT, fn)
  },
  vueAppConnected(fn: DevToolsEvent[DevToolsHooks.APP_CONNECTED]) {
    collectBuffer(DevToolsHooks.APP_CONNECTED, fn)
  },
  componentAdded(fn: DevToolsEvent[DevToolsHooks.COMPONENT_ADDED]) {
    collectBuffer(DevToolsHooks.COMPONENT_ADDED, fn)
  },
  componentUpdated(fn: DevToolsEvent[DevToolsHooks.COMPONENT_UPDATED]) {
    collectBuffer(DevToolsHooks.COMPONENT_UPDATED, fn)
  },
  componentRemoved(fn: DevToolsEvent[DevToolsHooks.COMPONENT_REMOVED]) {
    collectBuffer(DevToolsHooks.COMPONENT_REMOVED, fn)
  },
  setupDevtoolsPlugin(fn: DevToolsEvent[DevToolsHooks.SETUP_DEVTOOLS_PLUGIN]) {
    collectBuffer(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, fn)
  },
}

export function createDevToolsHook(): DevtoolsHook {
  return {
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

    callBuffer(DevToolsHooks.APP_INIT, app, version)
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

    callBuffer(DevToolsHooks.COMPONENT_ADDED, app, uid, parentUid, component)
  })

  // component updated hook
  hook.on(DevToolsHooks.COMPONENT_UPDATED, (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    callBuffer(DevToolsHooks.COMPONENT_UPDATED, app, uid, parentUid, component)
  })

  // component removed hook
  hook.on(DevToolsHooks.COMPONENT_REMOVED, async (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    callBuffer(DevToolsHooks.COMPONENT_REMOVED, app, uid, parentUid, component)
  })

  // devtools plugin setup
  hook.on(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, (pluginDescriptor: PluginDescriptor, setupFn: PluginSetupFunction) => {
    callBuffer(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, pluginDescriptor, setupFn)
  })
}

export const hook = {
  on,
}
