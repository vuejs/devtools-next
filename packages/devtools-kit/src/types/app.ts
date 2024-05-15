import type { App, ComponentInternalInstance, ComponentOptions, SuspenseBoundary } from 'vue'
import type { DevToolsPluginApi } from '../api'

export type PluginApi = DevToolsPluginApi

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

export type PluginSetupFunction = (api: PluginApi) => void

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
  __VUE_DEVTOOLS_NEXT_UID__: string
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
      __VUE_DEVTOOLS_NEXT_APP_RECORD_ID__: string
      __VUE_DEVTOOLS_NEXT_APP_RECORD__: AppRecord
    }
  }
  __VUE_DEVTOOLS_NEXT_APP_RECORD__: AppRecord
  suspense: SuspenseBoundary & { suspenseKey: string }
  renderContext: Record<string, unknown>
  devtoolsRawSetupState: Record<string, unknown>
  setupState: Record<string, unknown>
  provides: Record<string | symbol, unknown>
  ctx: Record<string, unknown>
} & App<any>
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
    vueQuery: boolean
    vueRouter: boolean
    veeValidate: boolean
    pinia: boolean
    vuex: boolean
    vueI18n: boolean
  }
}
