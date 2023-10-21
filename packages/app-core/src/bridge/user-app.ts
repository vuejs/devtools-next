import { devtools } from 'vue-devtools-kit'
import { BridgeEvents } from '@vue-devtools-next/schema'
import { Bridge, bridgeRpcCore, bridgeRpcEvents } from './core'

export function initBridgeRpc() {
  // inspector tree getter
  bridgeRpcCore.on(bridgeRpcEvents.inspectorTree, (payload) => {
    return devtools.context.api.getInspectorTree(payload)
  })

  // inspector state getter
  bridgeRpcCore.on(bridgeRpcEvents.inspectorState, (payload) => {
    return devtools.context.api.getInspectorState(payload)
  })

  // inspector tree updated
  devtools.context.api.on.sendInspectorTree((payload) => {
    Bridge.value.emit(BridgeEvents.SEND_INSPECTOR_TREE, payload)
  })

  // inspector state updated
  devtools.context.api.on.sendInspectorState((payload) => {
    Bridge.value.emit(BridgeEvents.SEND_INSPECTOR_STATE, payload)
  })
}

export class BridgeRpc {

}
