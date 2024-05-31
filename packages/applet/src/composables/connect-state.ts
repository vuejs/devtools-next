import { DevToolsMessagingEvents, rpc } from '@vue/devtools-core'
import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject, provide, ref, watch } from 'vue'

const VueDevToolsConnectStateSymbol: InjectionKey<ComputedRef<boolean>> = Symbol('VueDevToolsConnectStateSymbol')

export function createDevToolsConnectStateContext() {
  const appConnected = ref(false)
  const clientConnected = ref(false)
  const connected = computed(() => appConnected.value && clientConnected.value)

  rpc.value.devtoolsState().then(([data]) => {
    appConnected.value = data!.connected
    clientConnected.value = data!.clientConnected
  })

  rpc.functions.on(DevToolsMessagingEvents.DEVTOOLS_STATE_UPDATED, (data) => {
    appConnected.value = data.connected
    clientConnected.value = data.clientConnected
  })

  provide(VueDevToolsConnectStateSymbol, connected)

  return {
    connected,
  }
}

export function useDevToolsConnectState() {
  return inject(VueDevToolsConnectStateSymbol, ref(false))
}

export function onDevToolsClientConnected(callback: () => void) {
  const connected = useDevToolsConnectState()

  if (connected.value) {
    callback()
  }
  else {
    const stop = watch(connected, (value) => {
      if (value) {
        stop()
        callback()
      }
    })
  }
}
