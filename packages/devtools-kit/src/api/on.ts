import type { ComponentState, ComponentTreeNode, DevToolsState, VueAppInstance } from '@vue-devtools-next/schema'
import type { HookKeys, Hookable } from 'hookable'
import { createHooks } from 'hookable'

export enum DevToolsEvents {
  APP_CONNECTED = 'app:connected',
  DEVTOOLS_STATE_UPDATED = 'devtools:state-updated',
  COMPONENT_TREE_UPDATED = 'component-tree:updated',
  COMPONENT_STATE_UPDATED = 'component-state:updated',
  COMPONENT_STATE_INSPECT = 'component-state:inspect',
}

interface DevToolsEvent {
  [DevToolsEvents.DEVTOOLS_STATE_UPDATED]: (state: DevToolsState, oldState: DevToolsState) => void
  [DevToolsEvents.APP_CONNECTED]: () => void
  [DevToolsEvents.COMPONENT_TREE_UPDATED]: (data: ComponentTreeNode[]) => void
  [DevToolsEvents.COMPONENT_STATE_UPDATED]: (id: string) => void
  [DevToolsEvents.COMPONENT_STATE_INSPECT]: (payload: {
    componentInstance: VueAppInstance | undefined
    app: VueAppInstance | undefined
    instanceData: {
      id: string
      name: string
      file: string | undefined
      state: ComponentState[]
      instance: VueAppInstance | undefined
    }
  }) => void
}

// export const apiHooks: Hookable<DevToolsEvent, HookKeys<DevToolsEvent>> = target.__VUE_DEVTOOLS_API_HOOK ??= createHooks<DevToolsEvent>()
export const apiHooks: Hookable<DevToolsEvent, HookKeys<DevToolsEvent>> = createHooks<DevToolsEvent>()

export const on = {
  devtoolsStateUpdated(fn: DevToolsEvent[DevToolsEvents.DEVTOOLS_STATE_UPDATED]) {
    apiHooks.hook(DevToolsEvents.DEVTOOLS_STATE_UPDATED, fn)
  },
  vueAppConnected(fn: DevToolsEvent[DevToolsEvents.APP_CONNECTED]) {
    apiHooks.hook(DevToolsEvents.APP_CONNECTED, fn)
  },
  componentTreeUpdated(fn: DevToolsEvent[DevToolsEvents.COMPONENT_TREE_UPDATED]) {
    apiHooks.hook(DevToolsEvents.COMPONENT_TREE_UPDATED, fn)
  },
  componentStateUpdated(fn: DevToolsEvent[DevToolsEvents.COMPONENT_STATE_UPDATED]) {
    apiHooks.hook(DevToolsEvents.COMPONENT_STATE_UPDATED, fn)
  },
  // compatible
  inspectComponent(fn: DevToolsEvent[DevToolsEvents.COMPONENT_STATE_INSPECT]) {
    apiHooks.hook(DevToolsEvents.COMPONENT_STATE_INSPECT, fn)
  },
  visitComponentTree() {},
  getInspectorTree() {},
  sendInspectorTree() {},
  getInspectorState() {},
  sendInspectorState() {},
  editInspectorState() {},
  editComponentState() {},
}
