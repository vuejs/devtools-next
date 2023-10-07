import { DevToolsHooks, DevtoolsHook, VueAppInstance } from '@vue-devtools-next/schema'
import { target } from '@vue-devtools-next/shared'
import type { App } from 'vue'

type HookAppInstance = App & VueAppInstance

interface DevToolsHookEvents {
  [DevToolsHooks.APP_INIT]: (app: VueAppInstance['appContext']['app'], version: string) => void
  [DevToolsHooks.COMPONENT_ADDED]: (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => void
  [DevToolsHooks.COMPONENT_UPDATED]: (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => void
  [DevToolsHooks.COMPONENT_REMOVED]: (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => void
}

const devtoolsHookBuffer = {
  [DevToolsHooks.APP_INIT]: [] as Array<DevToolsHookEvents[DevToolsHooks.APP_INIT]>,
  [DevToolsHooks.COMPONENT_ADDED]: [] as Array<DevToolsHookEvents[DevToolsHooks.COMPONENT_ADDED]>,
  [DevToolsHooks.COMPONENT_UPDATED]: [] as Array<DevToolsHookEvents[DevToolsHooks.COMPONENT_UPDATED]>,
  [DevToolsHooks.COMPONENT_REMOVED]: [] as Array<DevToolsHookEvents[DevToolsHooks.COMPONENT_REMOVED]>,
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

export function onVueAppInit(subscribeFn: DevToolsHookEvents[DevToolsHooks.APP_INIT]) {
  devtoolsHookBuffer[DevToolsHooks.APP_INIT].push(subscribeFn)
}

export function onVueComponentAdded(subscribeFn: DevToolsHookEvents[DevToolsHooks.COMPONENT_ADDED]) {
  devtoolsHookBuffer[DevToolsHooks.COMPONENT_ADDED].push(subscribeFn)
}

export function onVueComponentUpdated(subscribeFn: DevToolsHookEvents[DevToolsHooks.COMPONENT_UPDATED]) {
  devtoolsHookBuffer[DevToolsHooks.COMPONENT_UPDATED].push(subscribeFn)
}

export function onVueComponentRemoved(subscribeFn: DevToolsHookEvents[DevToolsHooks.COMPONENT_REMOVED]) {
  devtoolsHookBuffer[DevToolsHooks.COMPONENT_REMOVED].push(subscribeFn)
}

export function subscribeDevToolsHook() {
  const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__
  // app init hook
  hook.on(DevToolsHooks.APP_INIT, (app: VueAppInstance['appContext']['app'], version: string) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    // call buffer
    devtoolsHookBuffer[DevToolsHooks.APP_INIT].forEach(fn => fn(app, version))
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

    // call buffer
    devtoolsHookBuffer[DevToolsHooks.COMPONENT_ADDED].forEach(fn => fn(app, uid, parentUid, component))
  })

  // component updated hook
  hook.on(DevToolsHooks.COMPONENT_UPDATED, (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    // call buffer
    devtoolsHookBuffer[DevToolsHooks.COMPONENT_UPDATED].forEach(fn => fn(app, uid, parentUid, component))
  })

  // component removed hook
  hook.on(DevToolsHooks.COMPONENT_REMOVED, async (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    // call buffer
    devtoolsHookBuffer[DevToolsHooks.COMPONENT_REMOVED].forEach(fn => fn(app, uid, parentUid, component))
  })
}
