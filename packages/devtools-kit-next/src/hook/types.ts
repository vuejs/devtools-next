import type { AppRecord } from '@vue/devtools-schema'

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
  id: string
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
