import { BridgeEvents } from '@vue-devtools-next/schema'
import { target } from '@vue-devtools-next/shared'
import type { Bridge } from './bridge'
import { checkVueAppInitialized } from './hook'
import { createDevToolsContext, updateDevToolsContext } from './context'

export function prepareInjection(bridge: InstanceType<typeof Bridge>) {
  bridge.on(BridgeEvents.CLIENT_READY, () => {
    target.__VUE_DEVTOOLS_CTX__ = createDevToolsContext()
    checkVueAppInitialized().then(() => {
      updateDevToolsContext({ connected: true })
      bridge.emit(BridgeEvents.APP_CONNECTED)
    })
  })
}
