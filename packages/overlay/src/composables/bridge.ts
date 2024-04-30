import type { Bridge } from '@vue/devtools-core'
import { shallowRef, watchEffect } from 'vue'

type BridgeType = InstanceType<typeof Bridge>

const bridgeRef = shallowRef<BridgeType | null>(null)

export function registerBridge(bridge: InstanceType<typeof Bridge>) {
  bridgeRef.value = bridge
}

export function waitBridgeReady() {
  return new Promise<BridgeType>((resolve) => {
    if (bridgeRef.value)
      resolve(bridgeRef.value)
    watchEffect(() => {
      if (bridgeRef.value)
        resolve(bridgeRef.value)
    })
  })
}
