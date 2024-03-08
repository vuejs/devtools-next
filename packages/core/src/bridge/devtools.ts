import { BridgeInstanceType } from './core'
import { setBridgeInstance, setBridgeTarget } from './shared'

export function setupDevToolsBridge(bridge: BridgeInstanceType) {
  setBridgeInstance(bridge)
  setBridgeTarget('devtools')
}
