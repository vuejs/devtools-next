import { BridgeEvents } from '@vue-devtools-next/schema'
import { Bridge, BridgeRpc } from './bridge'
import type { BridgeInstanceType } from './bridge'
import { checkVueAppInitialized } from './hook'
import { updateDevToolsContext } from './context'
import { HandShakeClient } from './handshake'

export function prepareInjection(bridge: BridgeInstanceType) {
  Bridge.value = bridge
  BridgeRpc.onDataFromDevTools()
  new HandShakeClient(bridge).onnConnect().then(() => {
    bridge.on(BridgeEvents.CLIENT_READY, () => {
      checkVueAppInitialized().then(() => {
        updateDevToolsContext({ connected: true })
        bridge.emit(BridgeEvents.APP_CONNECTED)
      })
    })
  })
}
