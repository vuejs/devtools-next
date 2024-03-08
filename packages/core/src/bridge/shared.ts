import { target } from '@vue/devtools-shared'
import { BridgeInstanceType } from './core'

export const BRIDGE_DEVTOOLS_ACTION_KEY = 'devtools:bridge-action'
export const BRIDGE_DEVTOOLS_LISTENER_KEY = 'devtools:bridge-listener'

export const BRIDGE_GLOBAL_VAR_KEY = '__vue_devtools_bridge__'
export const BRIDGE_TARET_KEY = '__vue_devtools_bridge_target__'

export const BRIDGE_DEVTOOLS_ACTION_EVENTS_KEY = 'devtools:bridge-action-events'
export const BRIDGE_DEVTOOLS_LISTENER_EVENTS_KEY = 'devtools:bridge-listener-events'

export const devtoolsActionEvents = target[BRIDGE_DEVTOOLS_ACTION_EVENTS_KEY] = new Map<string, Function>()
export const devtoolsListenerEvents = target[BRIDGE_DEVTOOLS_LISTENER_EVENTS_KEY] = new Map<string, Function>()

export function getBridgeInstance(): BridgeInstanceType {
  return target[BRIDGE_GLOBAL_VAR_KEY]
}

export function setBridgeInstance(instance: BridgeInstanceType) {
  target[BRIDGE_GLOBAL_VAR_KEY] = instance
}

export function setBridgeTarget(t: 'devtools' | 'app') {
  target[BRIDGE_TARET_KEY] = t
}

export function getBridgeTarget(): 'devtools' | 'app' {
  return target[BRIDGE_TARET_KEY]
}
