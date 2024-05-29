import { target as global } from '@vue/devtools-shared'

export interface DevToolsState {
  connected: boolean
  clientConnected: boolean
  vitePluginDetected: boolean
}

const STATE_KEY = '__VUE_DEVTOOLS_KIT_GLOBAL_STATE__'
function initStateFactory() {
  return {
    connected: false,
    clientConnected: false,
    vitePluginDetected: true,
  }
}
global[STATE_KEY] ??= initStateFactory()

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
    global[STATE_KEY][property] = value

    return true
  },
})

export function resetDevToolsState() {
  Object.assign(global[STATE_KEY], initStateFactory())
}

export function updateDevToolsState(state: Partial<DevToolsState>) {
  Object.assign(global[STATE_KEY], state)
}
