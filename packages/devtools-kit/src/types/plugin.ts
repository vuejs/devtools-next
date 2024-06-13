import type { App } from 'vue'
import type { DevToolsPluginAPI } from '../api'

type PluginSettingsItem = {
  label: string
  description?: string
} & ({
  type: 'boolean'
  defaultValue: boolean
} | {
  type: 'choice'
  defaultValue: string | number
  options: {
    value: string | number
    label: string
  }[]
  component?: 'select' | 'button-group'
} | {
  type: 'text'
  defaultValue: string
})

export type PluginSetupFunction = (api: InstanceType<typeof DevToolsPluginAPI>) => void

export interface PluginDescriptor {
  id: string
  label: string
  app: App<any>
  packageName?: string
  homepage?: string
  componentStateTypes?: string[]
  logo?: string
  disableAppScope?: boolean
  disablePluginScope?: boolean
  /**
   * Run the plugin setup and expose the api even if the devtools is not opened yet.
   * Useful to record timeline events early.
   */
  enableEarlyProxy?: boolean
  settings?: Record<string, PluginSettingsItem>
}

export interface DevToolsPlugin {
  descriptor: PluginDescriptor
  setupFn: PluginSetupFunction
}
