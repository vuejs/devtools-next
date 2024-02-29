import { devtools, onDevToolsConnected } from '@vue/devtools-kit'

import { initAppBridge } from './bridge'

import type { BridgeInstanceType } from './bridge'
import { HandShakeClient } from './handshake'

export function prepareInjection(bridge: BridgeInstanceType) {
  initAppBridge(bridge)
  new HandShakeClient(bridge).onnConnect().then(() => {
    bridge.on('devtools:client-ready', () => {
      onDevToolsConnected(() => {
        devtools.state.connected = true
      })
    })
  })
}
