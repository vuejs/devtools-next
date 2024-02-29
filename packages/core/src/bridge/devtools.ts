import { BridgeInstanceType } from './core'
import { setBridgeInstance } from './shared'

export function initDevToolsBridge(bridge: BridgeInstanceType) {
  setBridgeInstance(bridge)
}
