import { onDevToolsConnected } from '@vue/devtools-kit'
import { BridgeEvents, registerBridgeRpc } from './bridge'

import type { BridgeInstanceType } from './bridge/core'
import { HandShakeClient } from './handshake'

export function prepareInjection(bridge: BridgeInstanceType) {
  registerBridgeRpc('user-app', {
    bridge,
  })
  new HandShakeClient(bridge).onnConnect().then(() => {
    bridge.on(BridgeEvents.CLIENT_READY, () => {
      onDevToolsConnected(() => {
        bridge.emit(BridgeEvents.APP_CONNECTED)
      })
    })
  })
}
