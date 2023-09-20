import { BridgeEvents } from '@vue-devtools-next/schema'
import type { Bridge } from './bridge'

export function prepareInjection(bridge: InstanceType<typeof Bridge>) {
  bridge.on(BridgeEvents.CLIENT_READY, () => {
    console.log('CLIENT_READY')
  })
}
