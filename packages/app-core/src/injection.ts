import { BridgeEvents } from '@vue-devtools-next/schema'
import { onDevToolsConnected } from 'vue-devtools-kit'

import { Bridge, BridgeRpc, registerBridgeRpc } from './bridge'
import type { BridgeInstanceType } from './bridge'
import { HandShakeClient } from './handshake'
import { dispatchDevToolsRequests } from './dispatcher'

export function prepareInjection(bridge: BridgeInstanceType) {
  Bridge.value = bridge
  BridgeRpc.onDataFromDevTools({
    dispatcher: dispatchDevToolsRequests,
  })
  registerBridgeRpc('user-app')
  new HandShakeClient(bridge).onnConnect().then(() => {
    bridge.on(BridgeEvents.CLIENT_READY, () => {
      onDevToolsConnected(() => {
        bridge.emit(BridgeEvents.APP_CONNECTED)
      })
    })
  })
}
