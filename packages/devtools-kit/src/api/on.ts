import type { DevToolsState, VueAppInstance } from '@vue-devtools-next/schema'
import { target } from '@vue-devtools-next/shared'
import type { HookKeys, Hookable } from 'hookable'
import { createHooks } from 'hookable'
import type { ComponentBoundingRectApiPayload, ComponentTreeNode, InspectorState, InspectorStateApiPayload, InspectorStateEditorPayload, InspectorTreeApiPayload } from '../core/component/types'
import type { ScrollToComponentOptions, ToggleComponentInspectorOptions } from '../core/component-inspector/types'
import type { TimelineEvent } from '../core/timeline'
import type { RouterInfo } from '../core/router'
import type { CustomTab } from '../core/custom-tab/types'

export enum DevToolsEvents {
  DEVTOOLS_STATE_UPDATED = 'devtools:state-updated',
  ROUTER_INFO_UPDATED = 'router-info:updated',
  COMPONENT_STATE_INSPECT = 'component-state:inspect',
  TOGGLE_COMPONENT_INSPECTOR = 'component-inspector:toggle',
  GET_COMPONENT_BOUNDING_RECT = 'component-bounding-rect:get',
  SCROLL_TO_COMPONENT = 'scroll-to-component',
  GET_INSPECTOR_TREE = 'inspector-tree:get',
  SEND_INSPECTOR_TREE = 'inspector-tree:send',
  GET_INSPECTOR_STATE = 'inspector-state:get',
  EDIT_INSPECTOR_STATE = 'inspector-state:edit',
  SEND_INSPECTOR_STATE = 'inspector-state:send',
  VISIT_COMPONENT_TREE = 'component-tree:visit',
  ADD_TIMELINE_EVENT = 'timeline:add-event',
  CUSTOM_TABS_UPDATED = 'custom-tabs:updated',
}

export interface DevToolsEvent {
  [DevToolsEvents.DEVTOOLS_STATE_UPDATED]: (state: DevToolsState, oldState: DevToolsState) => void
  [DevToolsEvents.ROUTER_INFO_UPDATED]: (routerInfo: RouterInfo) => void
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
  [DevToolsEvents.TOGGLE_COMPONENT_INSPECTOR]: (payload: ToggleComponentInspectorOptions) => void
  [DevToolsEvents.GET_COMPONENT_BOUNDING_RECT]: (payload: ComponentBoundingRectApiPayload) => void
  [DevToolsEvents.SCROLL_TO_COMPONENT]: (payload: ScrollToComponentOptions) => void
  [DevToolsEvents.GET_INSPECTOR_TREE]: (payload: InspectorTreeApiPayload) => void
  [DevToolsEvents.SEND_INSPECTOR_TREE]: (payload: string) => void
  [DevToolsEvents.GET_INSPECTOR_STATE]: (payload: InspectorStateApiPayload) => void
  [DevToolsEvents.EDIT_INSPECTOR_STATE]: (payload: InspectorStateEditorPayload) => void
  [DevToolsEvents.SEND_INSPECTOR_STATE]: (payload: string) => void
  [DevToolsEvents.VISIT_COMPONENT_TREE]: (payload: {
    componentInstance: VueAppInstance | undefined
    app: VueAppInstance | undefined
    treeNode: ComponentTreeNode
    filter: string
  }) => void
  [DevToolsEvents.ADD_TIMELINE_EVENT]: (payload: TimelineEvent) => void
  [DevToolsEvents.CUSTOM_TABS_UPDATED]: (payload: CustomTab[]) => void
}

export const apiHooks: Hookable<DevToolsEvent, HookKeys<DevToolsEvent>> = target.__VUE_DEVTOOLS_API_HOOK ??= createHooks<DevToolsEvent>()
// export const apiHooks: Hookable<DevToolsEvent, HookKeys<DevToolsEvent>> = createHooks<DevToolsEvent>()

export const on = {
  devtoolsStateUpdated(fn: DevToolsEvent[DevToolsEvents.DEVTOOLS_STATE_UPDATED]) {
    apiHooks.hook(DevToolsEvents.DEVTOOLS_STATE_UPDATED, fn)
  },
  routerInfoUpdated(fn: DevToolsEvent[DevToolsEvents.ROUTER_INFO_UPDATED]) {
    apiHooks.hook(DevToolsEvents.ROUTER_INFO_UPDATED, fn)
  },
  getComponentBoundingRect(fn: DevToolsEvent[DevToolsEvents.GET_COMPONENT_BOUNDING_RECT]) {
    apiHooks.hook(DevToolsEvents.GET_COMPONENT_BOUNDING_RECT, fn)
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
  addTimelineEvent(fn: DevToolsEvent[DevToolsEvents.ADD_TIMELINE_EVENT]) {
    apiHooks.hook(DevToolsEvents.ADD_TIMELINE_EVENT, fn)
  },
  editInspectorState(fn: DevToolsEvent[DevToolsEvents.EDIT_INSPECTOR_STATE]) {
    apiHooks.hook(DevToolsEvents.EDIT_INSPECTOR_STATE, fn)
  },
  editComponentState() {},
  customTabsUpdated(fn: DevToolsEvent[DevToolsEvents.CUSTOM_TABS_UPDATED]) {
    apiHooks.hook(DevToolsEvents.CUSTOM_TABS_UPDATED, fn)
  },
}

export const clear = apiHooks.removeAllHooks.bind(apiHooks)
