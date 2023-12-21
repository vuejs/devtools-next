import type { App, ComponentInternalInstance, ComponentOptions, ConcreteComponent, SuspenseBoundary, VNode } from 'vue'

type CacheKey = string | number | symbol | ConcreteComponent
type Cache = Map<CacheKey, VNode>

export type VueAppInstance = ComponentInternalInstance & {
  type: {
    _componentTag: string | undefined
    components: Record<string, ComponentInternalInstance['type']>
    __VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__: string
    __isKeepAlive: boolean
    devtools: {
      hide: boolean
    }
    mixins: ComponentOptions[]
    extends: ComponentOptions
    vuex: {
      getters: Record<string, unknown>
    }
    computed: Record<string, unknown>
  }
  __v_cache: Cache
  __VUE_DEVTOOLS_UID__: string
  _isBeingDestroyed: boolean
  _instance: VueAppInstance
  _container: {
    _vnode: {
      component: VueAppInstance
    }
  }
  isUnmounted: boolean
  parent: VueAppInstance
  appContext: {
    app: VueAppInstance & App & {
      __VUE_DEVTOOLS_APP_RECORD_ID__: string
      __VUE_DEVTOOLS_APP_RECORD__: AppRecord
    }
  }
  __VUE_DEVTOOLS_APP_RECORD__: AppRecord
  suspense: SuspenseBoundary & { suspenseKey: string }
  renderContext: Record<string, unknown>
  devtoolsRawSetupState: Record<string, unknown>
  setupState: Record<string, unknown>
  provides: Record<string | symbol, unknown>
  ctx: Record<string, unknown>
}

export declare type PluginSettingsItem = {
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

export interface PluginDescriptor {
  id: string
  label: string
  app: VueAppInstance
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

// @TODO
export type PluginApi = any

export type PluginSetupFunction = (api: PluginApi) => void

export interface AppRecord {
  id: string | number
  name: string
  app?: App
  version?: string
  types?: Record<string, string | symbol>
  instanceMap: Map<string, VueAppInstance>
  rootInstance: VueAppInstance
  api?: PluginApi
  routerId?: string
  moduleDetectives?: {
    vueRouter: boolean
    pinia: boolean
  }
}

export interface DevToolsState {
  connected: boolean
  vitePluginDetected: boolean
  appRecords: AppRecord[]
  activeAppRecord: AppRecord | null
  selectedComponentId: string | null
  pluginBuffer: [PluginDescriptor, PluginSetupFunction][]
  tabs: unknown[]
  commands: unknown[]
  activeAppRecordId: string | null
}
