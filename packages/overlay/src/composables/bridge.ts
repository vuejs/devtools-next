import type { Bridge } from '@vue/devtools-next-core'
import { shallowRef, watchEffect } from 'vue'

type BridgeTye = InstanceType<typeof Bridge>

const bridgeRef = shallowRef<BridgeTye | null>(null)

export function registerBridge(bridge: InstanceType<typeof Bridge>) {
  bridgeRef.value = bridge
}

export function waitBridgeReady() {
  return new Promise<BridgeTye>((resolve) => {
    if (bridgeRef.value)
      resolve(bridgeRef.value)
    watchEffect(() => {
      if (bridgeRef.value)
        resolve(bridgeRef.value)
    })
  })
}
