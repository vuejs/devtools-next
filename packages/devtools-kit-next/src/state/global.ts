import { target as global } from '@vue/devtools-shared'

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

export const devtoolsState = new Proxy(global[STATE_KEY], {
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
    return true
  },
})
