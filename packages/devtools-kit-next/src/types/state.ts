import type { AppRecord, PluginDescriptor, PluginSetupFunction } from './app'

export interface DevToolsState {
  connected: boolean
  clientConnected: boolean
  vitePluginDetected: boolean
  appRecords: AppRecord[]
  activeAppRecord: AppRecord | null
  selectedComponentId: string | null
  pluginBuffer: [PluginDescriptor, PluginSetupFunction][]
  tabs: unknown[]
  commands: unknown[]
  activeAppRecordId: string | null
}
