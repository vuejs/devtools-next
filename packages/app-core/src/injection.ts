import { BridgeEvents } from '@vue-devtools-next/schema'
import { Bridge, BridgeRpc } from './bridge'
import { checkVueAppInitialized } from './hook'
import { updateDevToolsContext } from './context'

export function prepareInjection(bridge: InstanceType<typeof Bridge>) {
  Bridge.value = bridge
  BridgeRpc.onDataFromDevTools()
  bridge.on(BridgeEvents.CLIENT_READY, () => {
    checkVueAppInitialized().then(() => {
      updateDevToolsContext({ connected: true })
      bridge.emit(BridgeEvents.APP_CONNECTED)
    })
  })
}
