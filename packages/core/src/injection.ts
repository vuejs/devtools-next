import { devtools, onDevToolsConnected } from '@vue/devtools-kit'

import { setupAppBridge } from './bridge'

import type { BridgeInstanceType } from './bridge'
import { HandShakeClient } from './handshake'

export function prepareInjection(bridge: BridgeInstanceType) {
  setupAppBridge(bridge)
  new HandShakeClient(bridge).onnConnect().then(() => {
    bridge.on('devtools:client-ready', () => {
      onDevToolsConnected(() => {
        devtools.state.connected = true
      })
    })
  })
}
