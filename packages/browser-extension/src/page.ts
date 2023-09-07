enum DevToolsHooks {
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

function createDevToolsHook() {
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__ = {
    events: new Map<DevToolsHooks, () => void>(),
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

createDevToolsHook()

window.__VUE_DEVTOOLS_GLOBAL_HOOK__.on('app:init', (app) => {
  console.log('vue app', app)
})
