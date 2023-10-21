import type { App, ComponentInternalInstance, ComponentOptions, ConcreteComponent, SuspenseBoundary, VNode } from 'vue'

export enum DevToolsHooks {
  // internal
  APP_INIT = 'app:init',
  APP_UNMOUNT = 'app:unmount',
  COMPONENT_UPDATED = 'component:updated',
  COMPONENT_ADDED = 'component:added',
  COMPONENT_REMOVED = 'component:removed',
  COMPONENT_EMIT = 'component:emit',
  PERFORMANCE_START = 'perf:start',
  PERFORMANCE_END = 'perf:end',
  ADD_ROUTE = 'router:add-route',
  REMOVE_ROUTE = 'router:remove-route',
  RENDER_TRACKED = 'render:tracked',
  RENDER_TRIGGERED = 'render:triggered',
  APP_CONNECTED = 'app:connected',
  SETUP_DEVTOOLS_PLUGIN = 'devtools-plugin:setup',
}

export interface DevtoolsHook {
  enabled?: boolean
  events: Map<DevToolsHooks, Function[]>
  emit: (event: DevToolsHooks, ...payload: any[]) => void
  on: (event: DevToolsHooks, handler: Function) => () => void
  once: (event: DevToolsHooks, handler: Function) => void
  off: (event: DevToolsHooks, handler: Function) => void
  appRecords: AppRecord[]
  apps: Record<number, { componentCount: number }>
  cleanupBuffer?: (matchArg: unknown) => boolean
}

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
  api?: unknown
}

export interface ComponentTreeNode {
  uid: number | string
  id: string
  name: string
  renderKey: string | number
  inactive: boolean
  isFragment: boolean
  children: ComponentTreeNode[]
  domOrder?: number[]
  tags: {
    label: string
    textColor: number
    backgroundColor: number
  }[]
  autoOpen: boolean
}

export interface DevToolsState {
  connected: boolean
  appRecords: AppRecord[]
  activeAppRecord: AppRecord | null
  selectedComponentId: string | null
  pluginBuffer: [PluginDescriptor, PluginSetupFunction][]
}

export interface InspectorCustomState {
  _custom?: {
    type?: string
    displayText?: string
    tooltipText?: string
    value?: string
    stateTypeName?: string
    fields?: {
      abstract?: boolean
    }
  }
}

export interface InspectorState {
  key: string
  value: string | number | Record<string, unknown> | InspectorCustomState | Array<unknown>
  type: string
  stateTypeName?: string
  meta?: Record<string, boolean | string>
  raw?: string
  editable?: boolean
  children?: {
    key: string
    value: string | number
    type: string
  }[]
}

export interface DevToolsPluginInspectorState {
  id: string
  label: string
  icon?: string
  treeFilterPlaceholder?: string
  actions?: {
    icon: string
    tooltip: string
    action: (payload: unknown) => void
  }[]
}

export interface DevToolsPluginInspectorTree {
  app: VueAppInstance
  inspectorId: string
  filter?: string
  rootNodes: ComponentTreeNode[]
}

export interface DevToolsPluginInspectorState {
  app: VueAppInstance
  inspectorId: string
  nodeId: string
}
