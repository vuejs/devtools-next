import type { CustomCommand } from '../core/custom-command'
import type { CustomTab } from '../core/custom-tab'
import type { AppRecord, PluginDescriptor, PluginSetupFunction } from './app'

export interface DevToolsState {
  connected: boolean
  clientConnected: boolean
  vitePluginDetected: boolean
  appRecords: AppRecord[]
  activeAppRecord: AppRecord | null
  selectedComponentId: string | null
  pluginBuffer: [PluginDescriptor, PluginSetupFunction][]
  tabs: CustomTab[]
  commands: CustomCommand[]
  activeAppRecordId: string | null
}
