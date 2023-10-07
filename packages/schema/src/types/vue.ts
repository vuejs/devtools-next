import type { App, ComponentInternalInstance, ConcreteComponent, SuspenseBoundary, VNode } from 'vue'

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
  suspense: SuspenseBoundary & { suspenseKey: string }
}

export interface AppRecord {
  id: string | number
  name: string
  app?: App
  version?: string
  types?: Record<string, string | Symbol>
  instanceMap: Map<string, VueAppInstance>
  rootInstance: VueAppInstance
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
}
