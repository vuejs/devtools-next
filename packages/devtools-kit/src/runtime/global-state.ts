import { target as global } from '@vue-devtools-next/shared'
import { DevToolsEvents, callBuffer } from '../api'

const StateKey = '__VUE_DEVTOOLS_GLOBAL_STATE__'
global[StateKey] ??= {
  connected: false,
  appRecords: [],
  activeAppRecord: null,
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
    callBuffer(DevToolsEvents.DEVTOOLS_STATE_UPDATED, global[StateKey], oldState)
    return true
  },
  deleteProperty(target, property) {
    delete target[property]
    return true
  },
})
