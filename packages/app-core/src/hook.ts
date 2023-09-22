import { target } from '@vue-devtools-next/shared'
import { DevToolsHooks } from '@vue-devtools-next/schema'
import type { App } from 'vue'

export const HOOK = target.__VUE_DEVTOOLS_GLOBAL_HOOK__

export function createDevToolsHook() {
  // @TODO: override directly ?
  target.__VUE_DEVTOOLS_GLOBAL_HOOK__ ??= {
    appRecords: [],
    events: new Map<DevToolsHooks, Function[]>(),
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
  return target.__VUE_DEVTOOLS_GLOBAL_HOOK__
}

function collectHookBuffer() {
  const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__
  const hookBuffer = target.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER__
  const collectEvents = target.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER_COLLECT_EVENT__
  // app init hook
  const appInitCleanup = hook.on(DevToolsHooks.APP_INIT, (app: App & { _instance: { type: { devtools: { hide: boolean } } } }, version: string) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    hook.appRecords.push({
      id: hook.appRecords.length,
      app,
      version,
    })
    hookBuffer.push([DevToolsHooks.APP_INIT, { app, version }])
  })

  // component added hook
  const componentAddedCleanup = hook.on(DevToolsHooks.COMPONENT_ADDED, (...args) => {
    hookBuffer.push([DevToolsHooks.COMPONENT_ADDED, {
      ...args,
    }])
  })

  // component updated hook
  const componentUpdatedCleanup = hook.on(DevToolsHooks.COMPONENT_UPDATED, (...args) => {
    hookBuffer.push([DevToolsHooks.COMPONENT_UPDATED, {
      ...args,
    }])
  })

  // component removed hook
  const componentRemovedCleanup = hook.on(DevToolsHooks.COMPONENT_REMOVED, (...args) => {
    hookBuffer.push([DevToolsHooks.COMPONENT_REMOVED, {
      ...args,
    }])
  })

  // component emit hook
  const componentEmitCleanup = hook.on(DevToolsHooks.COMPONENT_EMIT, (...args) => {
    hookBuffer.push([DevToolsHooks.COMPONENT_EMIT, {
      ...args,
    }])
  })

  collectEvents.push(...[
    appInitCleanup,
    componentAddedCleanup,
    componentUpdatedCleanup,
    componentRemovedCleanup,
    componentEmitCleanup,
  ])
  // @TODO: handle dynamic router
}

export function initDevToolsHook() {
  createDevToolsHook()
  target.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER__ ??= []
  target.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER_COLLECT_EVENT__ ??= []
  collectHookBuffer()
}

export function checkVueAppInitialized() {
  const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__
  return new Promise<void>((resolve, reject) => {
    if (hook.appRecords.length) {
      resolve()
    }
    else {
      const timer = setInterval(() => {
        const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__

        if (hook.appRecords.length) {
          clearInterval(timer)
          resolve()
        }
      }, 200)

      // @TODO: reject logic
    }
  })
}
