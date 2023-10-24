import type { EditStateEventPayload, EditStateType } from 'vue-devtools-kit'
import { devtools, editState } from 'vue-devtools-kit'
import { BridgeEvents } from './types'
import { Bridge, bridgeRpcCore, bridgeRpcEvents } from './core'

export function registerBridgeRpc() {
  // devtools state getter
  bridgeRpcCore.on(bridgeRpcEvents.state, () => {
    return JSON.stringify({
      connected: devtools.state.connected,
      vueVersion: devtools.state?.activeAppRecord?.version || '',
    })
  })

  // devtools timeline layers getter
  bridgeRpcCore.on(bridgeRpcEvents.timelineLayer, () => {
    return JSON.stringify(devtools.context.timelineLayer)
  })

  // inspector tree getter
  bridgeRpcCore.on(bridgeRpcEvents.inspectorTree, (payload) => {
    return devtools.context.api.getInspectorTree(payload)
  })

  // inspector state getter
  bridgeRpcCore.on(bridgeRpcEvents.inspectorState, (payload) => {
    return devtools.context.api.getInspectorState(payload)
  })

  Bridge.value.on(BridgeEvents.APP_CONNECTED, () => {
    Bridge.value.emit(BridgeEvents.DEVTOOLS_STATE_UPDATED, JSON.stringify({
      vueVersion: devtools.state?.activeAppRecord?.version || '',
      connected: true,
    }))

    // devtools state updated
    devtools.context.api.on.devtoolsStateUpdated((payload) => {
      Bridge.value.emit(BridgeEvents.DEVTOOLS_STATE_UPDATED, JSON.stringify({
        vueVersion: payload?.activeAppRecord?.version || '',
        connected: payload.connected,
      }))
    })
    // inspector tree updated
    devtools.context.api.on.sendInspectorTree((payload) => {
      Bridge.value.emit(BridgeEvents.SEND_INSPECTOR_TREE, payload)
    })

    // inspector state updated
    devtools.context.api.on.sendInspectorState((payload) => {
      Bridge.value.emit(BridgeEvents.SEND_INSPECTOR_STATE, payload)
    })
  })

  Bridge.value.on(BridgeEvents.EDIT_STATE, async (payload: EditStateEventPayload<EditStateType>) => {
    await editState(payload)
  })
}

export class BridgeRpc {

}
