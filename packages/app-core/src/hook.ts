export enum DevToolsHooks {
  APP_INIT = 'app:init',
  APP_UNMOUNT = 'app:unmount',
  COMPONENT_UPDATED = 'component:updated',
  COMPONENT_ADDED = 'component:added',
  COMPONENT_REMOVED = 'component:removed',
  COMPONENT_EMIT = 'component:emit',
  PERFORMANCE_START = 'perf:start',
  PERFORMANCE_END = 'perf:end',
  ADD_ROUTE = 'router:add-route',
  REMOVE_ROUTE = 'router:remove-route',
  RENDER_TRACKED = 'render:tracked',
  RENDER_TRIGGERED = 'render:triggered',
}

export function createDevToolsHook() {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__ ??= {
    events: new Map<DevToolsHooks, () => void>(),
    on(event: DevToolsHooks, fn: () => void) {
      if (!this.events.has(event))
        this.events.set(event, [])

      this.events.get(event).push(fn)
      return [event, fn] as const
    },
    once(event: DevToolsHooks, fn) {
      const onceFn = (...args) => {
        this.off(event, onceFn)
        fn(...args)
      }

      this.on(event, onceFn)
      return [event, onceFn] as const
    },
    off(event: DevToolsHooks, fn) {
      if (this.events.has(event)) {
        const eventCallbacks = this.events.get(event)
        const index = eventCallbacks.indexOf(fn)
        if (index !== -1)
          eventCallbacks.splice(index, 1)
      }
    },
    emit(event: DevToolsHooks, ...payload) {
      if (this.events.has(event))
        this.events.get(event).forEach(fn => fn(...payload))
    },
  }
  return window.__VUE_DEVTOOLS_GLOBAL_HOOK__
}

function collectHookBuffer() {
  const hook = window.__VUE_DEVTOOLS_GLOBAL_HOOK__
  const hookBuffer = window.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER__
  const collectEvents = window.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER_COLLECT_EVENT__
  // app init hook
  const appInitCleanup = hook.on(DevToolsHooks.APP_INIT, (app) => {
    console.log('app:init', app)
    hookBuffer.push([DevToolsHooks.APP_INIT, app])
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
  window.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER__ ??= []
  window.__VUE_DEVTOOLS_GLOBAL_HOOK_BUFFER_COLLECT_EVENT__ ??= []
  collectHookBuffer()
}
