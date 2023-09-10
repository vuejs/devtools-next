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
    // @TODO: add once method for app:init hook?
    on(event: DevToolsHooks, fn: () => void) {
      if (!this.events.has(event))
        this.events.set(event, [])

      this.events.get(event).push(fn)
    },
    emit(event: DevToolsHooks, ...payload) {
      if (this.events.has(event))
        this.events.get(event).forEach(fn => fn(...payload))
    },
  }
  return window.__VUE_DEVTOOLS_GLOBAL_HOOK__
}

export function collectHookBuffer() {
  const hookBuffer: [string, Record<string, unknown>][] = []
  function collect(type: DevToolsHooks, args: Record<string, unknown>) {
    hookBuffer.push([type, args])
  }
  return {
    hookBuffer,
    collect,
  }
}
