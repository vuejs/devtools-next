import { onDevToolsConnected } from 'vue-devtools-kit'
import { Bridge, BridgeEvents, registerBridgeRpc } from './bridge'

import type { BridgeInstanceType } from './bridge/core'
import { HandShakeClient } from './handshake'

export function prepareInjection(bridge: BridgeInstanceType) {
  Bridge.value = bridge
  registerBridgeRpc('user-app')
  new HandShakeClient(bridge).onnConnect().then(() => {
    bridge.on(BridgeEvents.CLIENT_READY, () => {
      onDevToolsConnected(() => {
        bridge.emit(BridgeEvents.APP_CONNECTED)
      })
    })
  })
}
