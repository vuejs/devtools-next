import type { AppRecord, DevToolsState } from '@vue-devtools-next/schema'
import { deepClone, target as global } from '@vue-devtools-next/shared'
import { debounce } from 'perfect-debounce'
import type { DevToolsPluginApi } from '../../api'
import { DevToolsEvents, apiHooks } from '../../api'
import type { Router, RouterInfo } from '../router'
import { RouterKey, devtoolsRouterInfo, normalizeRouterInfo } from '../router'

const StateKey = '__VUE_DEVTOOLS_GLOBAL_STATE__'
const ContextKey = '__VUE_DEVTOOLS_CONTEXT__'
const DefaultContext = {
  appRecord: null,
  api: null,
  inspector: [],
  timelineLayer: [],
  routerInfo: {},
  router: null,
  activeInspectorTreeId: '',
  componentPluginHookBuffer: [],
}

global[StateKey] ??= {
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

global[ContextKey] ??= deepClone(DefaultContext)

const callStateUpdatedHook = debounce((state: DevToolsState, oldState: DevToolsState) => {
  apiHooks.callHook(DevToolsEvents.DEVTOOLS_STATE_UPDATED, state, oldState)
}, 80)

const callConnectedUpdatedHook = debounce((state: DevToolsState, oldState: DevToolsState) => {
  apiHooks.callHook(DevToolsEvents.DEVTOOLS_CONNECTED_UPDATED, state, oldState)
}, 80)

export const devtoolsState = new Proxy(global[StateKey], {
  get(target, property) {
    return global[StateKey][property]
  },
  set(target, property, value) {
    const oldState = { ...global[StateKey] }

    target[property] = value
    // sync to global to ensure the state is consistent
    global[StateKey][property] = value
    if (property === 'activeAppRecord') {
      // update context
      global[ContextKey].appRecord = value
      global[ContextKey].api = value.api
      global[ContextKey].inspector = value.inspector ?? []
      normalizeRouterInfo(value)
      global[ContextKey].routerInfo = devtoolsRouterInfo
    }

    callStateUpdatedHook(global[StateKey], oldState)
    if (['connected', 'clientConnected'].includes(property.toString()) && oldState[property] !== value)
      callConnectedUpdatedHook(global[StateKey], oldState)

    return true
  },
  deleteProperty(target, property) {
    delete target[property]
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

export const devtoolsContext = new Proxy(global[ContextKey], {
  get(target, property) {
    if (property === 'router')
      return global[RouterKey]

    else if (property === 'clear')
      return clearDevToolsContext

    return global[ContextKey][property]
  },
  set(target, property, value) {
    if (property === 'componentPluginHookBuffer')
      global[ContextKey][property] = value

    return true
  },
}) as unknown as {
  appRecord: AppRecord
  api: DevToolsPluginApi
  inspector: {
    id: string
    nodeId: string
    filter: string
    treeFilterPlaceholder: string
  }[]
  timelineLayer: {
    id: string
    label: string
    color: number
  }[]
  routerInfo: RouterInfo
  router: Router
  activeInspectorTreeId: string
  componentPluginHookBuffer: (() => void)[]
  clear: () => void
}

function clearDevToolsContext() {
  global[ContextKey] = deepClone(DefaultContext)
}
