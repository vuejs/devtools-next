import { ComponentTreeNode, DevToolsState, VueAppInstance } from '@vue-devtools-next/schema'
import { target } from '@vue-devtools-next/shared'
import type { App } from 'vue'

// @TODO: move to schema?
export enum DevToolsEvents {
  APP_INIT = 'app:init',
  APP_CONNECTED = 'app:connected',
  DEVTOOLS_STATE_UPDATED = 'devtools:state-updated',
  COMPONENT_ADDED = 'component:added',
  COMPONENT_UPDATED = 'component:updated',
  COMPONENT_REMOVED = 'component:removed',
  COMPONENT_TREE_UPDATED = 'component-tree:updated',
}

type HookAppInstance = App & VueAppInstance
interface DevToolsEvent {
  [DevToolsEvents.APP_INIT]: (app: VueAppInstance['appContext']['app'], version: string) => void
  [DevToolsEvents.DEVTOOLS_STATE_UPDATED]: (state: DevToolsState, oldState: DevToolsState) => void
  [DevToolsEvents.APP_CONNECTED]: () => void
  [DevToolsEvents.COMPONENT_ADDED]: (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => void
  [DevToolsEvents.COMPONENT_UPDATED]: DevToolsEvent['component:added']
  [DevToolsEvents.COMPONENT_REMOVED]: DevToolsEvent['component:added']
  [DevToolsEvents.COMPONENT_TREE_UPDATED]: (data: ComponentTreeNode[]) => void
}

const devtoolsEventsBuffer: {
  [P in DevToolsEvents]: Array<DevToolsEvent[P]>
} = target.__VUE_DEVTOOLS_EVENTS_BUFFER__ ??= {
  [DevToolsEvents.APP_INIT]: [],
  [DevToolsEvents.DEVTOOLS_STATE_UPDATED]: [],
  [DevToolsEvents.APP_CONNECTED]: [],
  [DevToolsEvents.COMPONENT_ADDED]: [],
  [DevToolsEvents.COMPONENT_UPDATED]: [],
  [DevToolsEvents.COMPONENT_REMOVED]: [],
  [DevToolsEvents.COMPONENT_TREE_UPDATED]: [],
}

function collectBuffer<T extends keyof DevToolsEvent>(event: T, fn: DevToolsEvent[T]) {
  devtoolsEventsBuffer[event].push(fn)
}

export function callBuffer<T extends keyof DevToolsEvent>(eventName: T, ...args: Parameters<DevToolsEvent[T]>) {
  // @ts-expect-error tuple rest
  devtoolsEventsBuffer[eventName].forEach(fn => fn(...args))
}

export const on = {
  vueAppInit(fn: DevToolsEvent[DevToolsEvents.APP_INIT]) {
    collectBuffer(DevToolsEvents.APP_INIT, fn)
  },
  devtoolsStateUpdated(fn: DevToolsEvent[DevToolsEvents.DEVTOOLS_STATE_UPDATED]) {
    collectBuffer(DevToolsEvents.DEVTOOLS_STATE_UPDATED, fn)
  },
  vueAppConnected(fn: DevToolsEvent[DevToolsEvents.APP_CONNECTED]) {
    collectBuffer(DevToolsEvents.APP_CONNECTED, fn)
  },
  componentAdded(fn: DevToolsEvent[DevToolsEvents.COMPONENT_ADDED]) {
    collectBuffer(DevToolsEvents.COMPONENT_ADDED, fn)
  },
  componentUpdated(fn: DevToolsEvent[DevToolsEvents.COMPONENT_UPDATED]) {
    collectBuffer(DevToolsEvents.COMPONENT_UPDATED, fn)
  },
  componentRemoved(fn: DevToolsEvent[DevToolsEvents.COMPONENT_REMOVED]) {
    collectBuffer(DevToolsEvents.COMPONENT_REMOVED, fn)
  },
  componentTreeUpdated(fn: DevToolsEvent[DevToolsEvents.COMPONENT_TREE_UPDATED]) {
    collectBuffer(DevToolsEvents.COMPONENT_TREE_UPDATED, fn)
  },
}
