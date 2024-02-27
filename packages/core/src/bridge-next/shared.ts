import { target } from '@vue/devtools-shared'
import { BridgeInstanceType } from '../bridge/core'

export const BRIDGE_DEVTOOLS_ACTION_KEY = 'devtools:bridge-action'
export const BRIDGE_DEVTOOLS_LISTENER_KEY = 'devtools:bridge-listener'

export const BRIDGE_GLOBAL_VAR_KEY = '__vue_devtools_bridge__'

export function getBridgeInstance(): BridgeInstanceType {
  return target[BRIDGE_GLOBAL_VAR_KEY]
}

export function setBridgeInstance(instance: BridgeInstanceType) {
  target[BRIDGE_GLOBAL_VAR_KEY] = instance
}
