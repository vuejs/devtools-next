import type { AppRecord, CustomCommand, CustomTab } from '@vue/devtools-kit'
import { DevToolsMessagingEvents, rpc } from '@vue/devtools-core'
import { onDevToolsConnected } from '~/composables/connection'

export type DevtoolsBridgeAppRecord = Pick<AppRecord, 'name' | 'id' | 'version' | 'routerId' | 'moduleDetectives'>

// @TODO: move to applet or core
export function useDevToolsState() {
  const connected = ref(false)
  const clientConnected = ref(false)
  const vueVersion = ref('')
  const tabs = ref<CustomTab[]>([])
  const commands = ref<CustomCommand[]>([])
  const vitePluginDetected = ref(false)
  const appRecords = ref<Array<DevtoolsBridgeAppRecord>>([])
  const activeAppRecordId = ref('')

  // @TODO: types
  function updateState(data) {
    connected.value = data.connected
    clientConnected.value = data.clientConnected
    vueVersion.value = data.vueVersion || ''
    tabs.value = data.tabs
    commands.value = data.commands
    vitePluginDetected.value = data.vitePluginDetected
    appRecords.value = data.appRecords
    activeAppRecordId.value = data.activeAppRecordId!
  }

  onDevToolsConnected(() => {
    rpc.value.devtoolsState().then(([data]) => {
      updateState(data)
    })
    rpc.functions.on(DevToolsMessagingEvents.DEVTOOLS_STATE_UPDATED, (data) => {
      updateState(data)
    })
  })

  return {
    connected,
    clientConnected,
    vueVersion,
    tabs,
    commands,
    vitePluginDetected,
    appRecords,
    activeAppRecordId,
  }
}
