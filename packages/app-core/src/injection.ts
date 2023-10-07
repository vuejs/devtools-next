import { BridgeEvents } from '@vue-devtools-next/schema'
import { devtools, onDevToolsConnected } from 'vue-devtools-kit'

import { Bridge, BridgeRpc } from './bridge'
import type { BridgeInstanceType } from './bridge'
import { updateDevToolsContext } from './context'
import { HandShakeClient } from './handshake'
import { dispatchDevToolsRequests, syncUpdatedToDevTools } from './dispatcher'

export function prepareInjection(bridge: BridgeInstanceType) {
  Bridge.value = bridge
  BridgeRpc.onDataFromDevTools({
    dispatcher: dispatchDevToolsRequests,
    syncer: syncUpdatedToDevTools,
  })
  new HandShakeClient(bridge).onnConnect().then(() => {
    bridge.on(BridgeEvents.CLIENT_READY, () => {
      onDevToolsConnected(() => {
        const { activeAppRecord } = devtools.state
        updateDevToolsContext({ connected: true, activeAppVueVersion: activeAppRecord?.version })
        bridge.emit(BridgeEvents.APP_CONNECTED)
      })
    })
  })
}
