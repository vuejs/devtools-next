import type { DevToolsState, VueAppInstance } from '@vue-devtools-next/schema'
import type { HookKeys, Hookable } from 'hookable'
import type { ComponentTreeNode, InspectorStateApiPayload, InspectorTreeApiPayload } from 'vue-devtools-kit'
import { createHooks } from 'hookable'
import type { InspectorState } from '../core/component/types'

export enum DevToolsEvents {
  DEVTOOLS_STATE_UPDATED = 'devtools:state-updated',
  COMPONENT_STATE_INSPECT = 'component-state:inspect',
  GET_INSPECTOR_TREE = 'inspector-tree:get',
  SEND_INSPECTOR_TREE = 'inspector-tree:send',
  GET_INSPECTOR_STATE = 'inspector-state:get',
  SEND_INSPECTOR_STATE = 'inspector-state:send',
  VISIT_COMPONENT_TREE = 'component-tree:visit',
}

export interface DevToolsEvent {
  [DevToolsEvents.DEVTOOLS_STATE_UPDATED]: (state: DevToolsState, oldState: DevToolsState) => void
  [DevToolsEvents.COMPONENT_STATE_INSPECT]: (payload: {
    componentInstance: VueAppInstance | undefined
    app: VueAppInstance | undefined
    instanceData: {
      id: string
      name: string
      file: string | undefined
      state: InspectorState[]
      instance: VueAppInstance | undefined
    }
  }) => void
  [DevToolsEvents.GET_INSPECTOR_TREE]: (payload: InspectorTreeApiPayload) => void
  [DevToolsEvents.SEND_INSPECTOR_TREE]: (payload: string) => void
  [DevToolsEvents.GET_INSPECTOR_STATE]: (payload: InspectorStateApiPayload) => void
  [DevToolsEvents.SEND_INSPECTOR_STATE]: (payload: string) => void
  [DevToolsEvents.VISIT_COMPONENT_TREE]: (payload: {
    componentInstance: VueAppInstance | undefined
    app: VueAppInstance | undefined
    treeNode: ComponentTreeNode
    filter: string
  }) => void
}

// export const apiHooks: Hookable<DevToolsEvent, HookKeys<DevToolsEvent>> = target.__VUE_DEVTOOLS_API_HOOK ??= createHooks<DevToolsEvent>()
export const apiHooks: Hookable<DevToolsEvent, HookKeys<DevToolsEvent>> = createHooks<DevToolsEvent>()

export const on = {
  devtoolsStateUpdated(fn: DevToolsEvent[DevToolsEvents.DEVTOOLS_STATE_UPDATED]) {
    apiHooks.hook(DevToolsEvents.DEVTOOLS_STATE_UPDATED, fn)
  },
  // compatible
  inspectComponent(fn: DevToolsEvent[DevToolsEvents.COMPONENT_STATE_INSPECT]) {
    apiHooks.hook(DevToolsEvents.COMPONENT_STATE_INSPECT, fn)
  },
  visitComponentTree(fn: DevToolsEvent[DevToolsEvents.VISIT_COMPONENT_TREE]) {
    apiHooks.hook(DevToolsEvents.VISIT_COMPONENT_TREE, fn)
  },
  getInspectorTree(fn: DevToolsEvent[DevToolsEvents.GET_INSPECTOR_TREE]) {
    apiHooks.hook(DevToolsEvents.GET_INSPECTOR_TREE, fn)
  },
  getInspectorState(fn: DevToolsEvent[DevToolsEvents.GET_INSPECTOR_STATE]) {
    apiHooks.hook(DevToolsEvents.GET_INSPECTOR_STATE, fn)
  },
  // private
  sendInspectorTree(fn: DevToolsEvent[DevToolsEvents.SEND_INSPECTOR_TREE]) {
    apiHooks.hook(DevToolsEvents.SEND_INSPECTOR_TREE, fn)
  },
  sendInspectorState(fn: DevToolsEvent[DevToolsEvents.SEND_INSPECTOR_STATE]) {
    apiHooks.hook(DevToolsEvents.SEND_INSPECTOR_STATE, fn)
  },
  editInspectorState() {},
  editComponentState() {},
}
