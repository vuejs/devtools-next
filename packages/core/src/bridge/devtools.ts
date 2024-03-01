import { BridgeInstanceType } from './core'
import { setBridgeInstance } from './shared'

export function setupDevToolsBridge(bridge: BridgeInstanceType) {
  setBridgeInstance(bridge)
}
