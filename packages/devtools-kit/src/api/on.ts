import type { ComponentTreeNode, DevToolsState, VueAppInstance } from '@vue-devtools-next/schema'
import { target } from '@vue-devtools-next/shared'
import type { App } from 'vue'

export enum DevToolsEvents {
  APP_CONNECTED = 'app:connected',
  DEVTOOLS_STATE_UPDATED = 'devtools:state-updated',
  COMPONENT_TREE_UPDATED = 'component-tree:updated',
  COMPONENT_STATE_UPDATED = 'component-state:updated',
}

type HookAppInstance = App & VueAppInstance
interface DevToolsEvent {
  [DevToolsEvents.DEVTOOLS_STATE_UPDATED]: (state: DevToolsState, oldState: DevToolsState) => void
  [DevToolsEvents.APP_CONNECTED]: () => void
  [DevToolsEvents.COMPONENT_TREE_UPDATED]: (data: ComponentTreeNode[]) => void
  [DevToolsEvents.COMPONENT_STATE_UPDATED]: (id: string) => void
}

const devtoolsEventsBuffer: {
  [P in DevToolsEvents]: Array<DevToolsEvent[P]>
} = target.__VUE_DEVTOOLS_EVENTS_BUFFER__ ??= {
  [DevToolsEvents.DEVTOOLS_STATE_UPDATED]: [],
  [DevToolsEvents.APP_CONNECTED]: [],
  [DevToolsEvents.COMPONENT_TREE_UPDATED]: [],
  [DevToolsEvents.COMPONENT_STATE_UPDATED]: [],
}

function collectBuffer<T extends keyof DevToolsEvent>(event: T, fn: DevToolsEvent[T]) {
  devtoolsEventsBuffer[event].push(fn)
}

export function callBuffer<T extends keyof DevToolsEvent>(eventName: T, ...args: Parameters<DevToolsEvent[T]>) {
  // @ts-expect-error tuple rest
  devtoolsEventsBuffer[eventName].forEach(fn => fn(...args))
}

export const on = {
  devtoolsStateUpdated(fn: DevToolsEvent[DevToolsEvents.DEVTOOLS_STATE_UPDATED]) {
    collectBuffer(DevToolsEvents.DEVTOOLS_STATE_UPDATED, fn)
  },
  vueAppConnected(fn: DevToolsEvent[DevToolsEvents.APP_CONNECTED]) {
    collectBuffer(DevToolsEvents.APP_CONNECTED, fn)
  },
  componentTreeUpdated(fn: DevToolsEvent[DevToolsEvents.COMPONENT_TREE_UPDATED]) {
    collectBuffer(DevToolsEvents.COMPONENT_TREE_UPDATED, fn)
  },
  componentStateUpdated(fn: DevToolsEvent[DevToolsEvents.COMPONENT_STATE_UPDATED]) {
    collectBuffer(DevToolsEvents.COMPONENT_STATE_UPDATED, fn)
  },
  // compatible
  inspectComponent() {
    console.log('ok?')
  },
  visitComponentTree() {},
  getInspectorTree() {},
  sendInspectorTree() {},
  getInspectorState() {},
  sendInspectorState() {},
  editInspectorState() {},
  editComponentState() {},
}
