import { target } from '@vue/devtools-shared'
import { createHooks } from 'hookable'
import type { Hookable, HookKeys } from 'hookable'
import { devtoolsState } from '../ctx'
import { DevToolsEvent, DevToolsHook, DevToolsHooks, VueHooks } from '../types'

export { VueHooks } from '../types'

export const devtoolsHooks: Hookable<DevToolsEvent, HookKeys<DevToolsEvent>> = target.__VUE_DEVTOOLS_HOOK ??= createHooks<DevToolsEvent>()

const on: VueHooks['on'] = {
  vueAppInit(fn) {
    devtoolsHooks.hook(DevToolsHooks.APP_INIT, fn)
  },
  vueAppUnmount(fn) {
    devtoolsHooks.hook(DevToolsHooks.APP_UNMOUNT, fn)
  },
  vueAppConnected(fn) {
    devtoolsHooks.hook(DevToolsHooks.APP_CONNECTED, fn)
  },
  componentAdded(fn) {
    return devtoolsHooks.hook(DevToolsHooks.COMPONENT_ADDED, fn)
  },
  componentUpdated(fn) {
    return devtoolsHooks.hook(DevToolsHooks.COMPONENT_UPDATED, fn)
  },
  componentRemoved(fn) {
    return devtoolsHooks.hook(DevToolsHooks.COMPONENT_REMOVED, fn)
  },
  setupDevtoolsPlugin(fn) {
    devtoolsHooks.hook(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, fn)
  },
}

export function createDevToolsHook(): DevToolsHook {
  return {
    id: 'vue-devtools-next',
    devtoolsVersion: '7.0',
    enabled: false,
    appRecords: [],
    apps: [],
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
  const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__ as DevToolsHook
  // app init hook
  hook.on<DevToolsEvent[DevToolsHooks.APP_INIT]>(DevToolsHooks.APP_INIT, (app, version) => {
    if (app?._instance?.type?.devtools?.hide)
      return

    devtoolsHooks.callHook(DevToolsHooks.APP_INIT, app, version)
  })

  hook.on<DevToolsEvent[DevToolsHooks.APP_UNMOUNT]>(DevToolsHooks.APP_UNMOUNT, (app) => {
    devtoolsHooks.callHook(DevToolsHooks.APP_UNMOUNT, app)
  })

  // component added hook
  hook.on<DevToolsEvent[DevToolsHooks.COMPONENT_ADDED]>(DevToolsHooks.COMPONENT_ADDED, async (app, uid, parentUid, component) => {
    if (app?._instance?.type?.devtools?.hide || devtoolsState.highPerfModeEnabled)
      return

    if (!app || (typeof uid !== 'number' && !uid) || !component)
      return

    devtoolsHooks.callHook(DevToolsHooks.COMPONENT_ADDED, app, uid, parentUid, component)
  })

  // component updated hook
  hook.on<DevToolsEvent[DevToolsHooks.COMPONENT_UPDATED]>(DevToolsHooks.COMPONENT_UPDATED, (app, uid, parentUid, component) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component || devtoolsState.highPerfModeEnabled)
      return

    devtoolsHooks.callHook(DevToolsHooks.COMPONENT_UPDATED, app, uid, parentUid, component)
  })

  // component removed hook
  hook.on<DevToolsEvent[DevToolsHooks.COMPONENT_REMOVED]>(DevToolsHooks.COMPONENT_REMOVED, async (app, uid, parentUid, component) => {
    if (!app || (typeof uid !== 'number' && !uid) || !component || devtoolsState.highPerfModeEnabled)
      return

    devtoolsHooks.callHook(DevToolsHooks.COMPONENT_REMOVED, app, uid, parentUid, component)
  })

  // devtools plugin setup
  hook.on<DevToolsEvent[DevToolsHooks.SETUP_DEVTOOLS_PLUGIN]>(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, (pluginDescriptor, setupFn, options) => {
    if (options?.target === 'legacy')
      return
    devtoolsHooks.callHook(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, pluginDescriptor, setupFn)
  })
}

export const hook: VueHooks = {
  on,
  setupDevToolsPlugin(pluginDescriptor, setupFn) {
    return devtoolsHooks.callHook(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, pluginDescriptor, setupFn)
  },
}
