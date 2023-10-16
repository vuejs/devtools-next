import type { AppRecord } from '@vue-devtools-next/schema'
import { target as global } from '@vue-devtools-next/shared'
import type { DevToolsPluginApi } from '../../api'
import { DevToolsEvents, callBuffer } from '../../api'

const StateKey = '__VUE_DEVTOOLS_GLOBAL_STATE__'
const ContextKey = '__VUE_DEVTOOLS_CONTEXT__'
global[StateKey] ??= {
  connected: false,
  appRecords: [],
  activeAppRecord: null,
  selectedComponentId: null,
  pluginBuffer: [],
}
global[ContextKey] ??= {
  appRecord: null,
  api: null,
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
      global[ContextKey].appRecord = value
      global[ContextKey].api = value.api
    }

    callBuffer(DevToolsEvents.DEVTOOLS_STATE_UPDATED, global[StateKey], oldState)
    return true
  },
  deleteProperty(target, property) {
    delete target[property]
    return true
  },
})

export const devtoolsContext = new Proxy(global[ContextKey], {
  get(target, property) {
    return global[ContextKey][property]
  },
}) as unknown as {
  appRecord: AppRecord
  api: DevToolsPluginApi
}
