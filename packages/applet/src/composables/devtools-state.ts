import { DevToolsMessagingEvents, onRpcConnected, rpc } from '@vue/devtools-core'
import { onUnmounted, ref } from 'vue'

import type { AppRecord } from '@vue/devtools-kit'

export type DevtoolsAppRecord = Pick<AppRecord, 'name' | 'id' | 'version' | 'routerId'>

export function useDevToolsState() {
  const appRecords = ref<Array<DevtoolsAppRecord>>([])
  const activeAppRecordId = ref('')
  const connected = ref(false)
  const clientConnected = ref(false)

  function onStateUpdated(data) {
    appRecords.value = data.appRecords
    activeAppRecordId.value = data.activeAppRecordId!
    connected.value = data.connected
    clientConnected.value = data!.clientConnected
  }
  onRpcConnected(() => {
    rpc.value.devtoolsState().then(([data]) => {
      appRecords.value = data!.appRecords
      activeAppRecordId.value = data!.activeAppRecordId!
      connected.value = data.connected
      clientConnected.value = data!.clientConnected
    })

    rpc.functions.on(DevToolsMessagingEvents.DEVTOOLS_STATE_UPDATED, onStateUpdated)
  })
  onUnmounted(() => {
    rpc.functions.off(DevToolsMessagingEvents.DEVTOOLS_STATE_UPDATED, onStateUpdated)
  })

  return {
    appRecords,
    activeAppRecordId,
    connected,
    clientConnected,
  }
}
