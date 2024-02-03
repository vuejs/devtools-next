import { target as global } from '@vue/devtools-shared'
import { debounce } from 'perfect-debounce'
import type { DevToolsState } from '../types'
import { DevToolsEvents, apiHooks } from '../api'

export type { DevToolsState } from '../types'

const STATE_KEY = '__VUE_DEVTOOLS_GLOBAL_STATE__'
const INITIAL_STATE = {
  connected: false,
  clientConnected: false,
  appRecords: [],
  activeAppRecord: null,
  selectedComponentId: null,
  pluginBuffer: [],
  tabs: [],
  commands: [],
  vitePluginDetected: false,
  activeAppRecordId: null,
}

global[STATE_KEY] ??= INITIAL_STATE

export function resetDevToolsState() {
  global[STATE_KEY] = INITIAL_STATE
}

export const callStateUpdatedHook = debounce((state: DevToolsState, oldState: DevToolsState) => {
  apiHooks.callHook(DevToolsEvents.DEVTOOLS_STATE_UPDATED, state, oldState)
}, 80)

export const callConnectedUpdatedHook = debounce((state: DevToolsState, oldState: DevToolsState) => {
  apiHooks.callHook(DevToolsEvents.DEVTOOLS_CONNECTED_UPDATED, state, oldState)
}, 80)

export const devtoolsState: DevToolsState = new Proxy(global[STATE_KEY], {
  get(target, property) {
    return global[STATE_KEY][property]
  },
  deleteProperty(target, property) {
    delete target[property]
    return true
  },
  set(target, property, value) {
    const oldState = { ...global[STATE_KEY] }

    target[property] = value
    // sync to global to ensure the state is consistent
    global[STATE_KEY][property] = value

    callStateUpdatedHook(global[STATE_KEY], oldState)
    if (['connected', 'clientConnected'].includes(property.toString()) && oldState[property] !== value)
      callConnectedUpdatedHook(global[STATE_KEY], oldState)

    return true
  },
})

Object.defineProperty(devtoolsState.tabs, 'push', {
  configurable: true,
  value(...items: unknown[]) {
    const result = Array.prototype.push.apply(this, items)
    devtoolsState.tabs = this
    apiHooks.callHook(DevToolsEvents.CUSTOM_TABS_UPDATED, this)
    return result
  },
})

;['push', 'splice'].forEach((method) => {
  Object.defineProperty(devtoolsState.commands, method, {
    configurable: true,
    value(...args: unknown[]) {
      const result = Array.prototype[method].apply(this, args)
      devtoolsState.commands = this
      apiHooks.callHook(DevToolsEvents.CUSTOM_COMMANDS_UPDATED, this)
      return result
    },
  })
})
