import { DevToolsHooks, DevtoolsHook, VueAppInstance } from '@vue-devtools-next/schema'
import { target } from '@vue-devtools-next/shared'
import type { App } from 'vue'
import { DevToolsEvents, callBuffer } from '../api'

type HookAppInstance = App & VueAppInstance

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

    callBuffer(DevToolsEvents.APP_INIT, app, version)
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

    callBuffer(DevToolsEvents.COMPONENT_ADDED, app, uid, parentUid, component)
  })

  // component updated hook
  hook.on(DevToolsHooks.COMPONENT_UPDATED, (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    callBuffer(DevToolsEvents.COMPONENT_UPDATED, app, uid, parentUid, component)
  })

  // component removed hook
  hook.on(DevToolsHooks.COMPONENT_REMOVED, async (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    callBuffer(DevToolsEvents.COMPONENT_REMOVED, app, uid, parentUid, component)
  })
}
