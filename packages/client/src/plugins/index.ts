import type { App, InjectionKey, Ref } from 'vue'
import type { AppRecord, CustomCommand, CustomTab } from '@vue/devtools-kit'
import { rpc } from '@vue/devtools-core'
import { onDevToolsConnected } from '~/composables/connection'

export type DevtoolsBridgeAppRecord = Pick<AppRecord, 'name' | 'id' | 'version' | 'routerId' | 'moduleDetectives'>
export const VueDevToolsStateSymbol: InjectionKey<{
  connected: Ref<boolean>
  clientConnected: Ref<boolean>
  vueVersion: Ref<string>
  tabs: Ref<CustomTab[]>
  commands: Ref<CustomCommand[]>
  vitePluginDetected: Ref<boolean>
  appRecords: Ref<Array<DevtoolsBridgeAppRecord>>
  activeAppRecordId: Ref<string>
}> = Symbol('VueDevToolsStateSymbol')

export function createDevToolsPlugin() {
  return {
    install(app: App) {
      const connected = ref(false)
      const clientConnected = ref(false)
      const vueVersion = ref('')
      const tabs = ref<CustomTab[]>([])
      const commands = ref<CustomCommand[]>([])
      const vitePluginDetected = ref(false)
      const appRecords = ref<Array<DevtoolsBridgeAppRecord>>([])
      const activeAppRecordId = ref('')

      onDevToolsConnected(() => {
        rpc.value.devtoolsState().then(([data]) => {
          connected.value = data.connected
          clientConnected.value = data.clientConnected
          vueVersion.value = data.vueVersion || ''
          tabs.value = data.tabs
          commands.value = data.commands
          vitePluginDetected.value = data.vitePluginDetected
          appRecords.value = data.appRecords
          activeAppRecordId.value = data.activeAppRecordId!
        })
      })
      app.provide(VueDevToolsStateSymbol, {
        connected,
        clientConnected,
        vueVersion,
        tabs,
        commands,
        vitePluginDetected,
        appRecords,
        activeAppRecordId,
      })
    },
  }
}
