import type { AppRecord } from '@vue-devtools-next/schema'
import { target as global } from '@vue-devtools-next/shared'
import type { DevToolsPluginApi } from '../../api'
import { DevToolsEvents, apiHooks } from '../../api'
import type { Router, RouterInfo } from '../router'
import { RouterKey, devtoolsRouterInfo, normalizeRouterInfo } from '../router'

const StateKey = '__VUE_DEVTOOLS_GLOBAL_STATE__'
const ContextKey = '__VUE_DEVTOOLS_CONTEXT__'
global[StateKey] ??= {
  connected: false,
  appRecords: [],
  activeAppRecord: null,
  selectedComponentId: null,
  pluginBuffer: [],
  tabs: [],
}
global[ContextKey] ??= {
  appRecord: null,
  api: null,
  inspector: [],
  timelineLayer: [],
  routerInfo: {},
  router: null,
  activeInspectorTreeId: '',
}

export const devtoolsState = new Proxy(global[StateKey], {
  get(target, property) {
    return global[StateKey][property]
  },
  set(target, property, value) {
    const oldState = global[StateKey]
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

    apiHooks.callHook(DevToolsEvents.DEVTOOLS_STATE_UPDATED, global[StateKey], oldState)
    return true
  },
  deleteProperty(target, property) {
    delete target[property]
    return true
  },
})

Object.defineProperty(devtoolsState.tabs, 'push', {
  configurable: true,
  value(...items) {
    const result = Array.prototype.push.apply(this, items)
    devtoolsState.tabs = this
    apiHooks.callHook(DevToolsEvents.CUSTOM_TABS_UPDATED, this)
    return result
  },
})

export const devtoolsContext = new Proxy(global[ContextKey], {
  get(target, property) {
    if (property === 'router')
      return global[RouterKey]

    return global[ContextKey][property]
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
}
