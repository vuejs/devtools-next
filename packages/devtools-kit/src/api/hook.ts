import type { HookKeys, Hookable } from 'hookable'
import { target } from '@vue/devtools-shared'
import { createHooks } from 'hookable'
import type { TimelineEvent } from '../core/timeline'
import type { ComponentHighLighterOptions, ScrollToComponentOptions } from '../core/component-highlighter'
import type { ComponentBoundingRectApiPayload, ComponentTreeNode, InspectorStateApiPayload, InspectorStateEditorPayload, InspectorTreeApiPayload } from '../core/component/types'
import type { DevToolsState, RouterInfo, VueAppInstance } from '../types'
import type { CustomTab } from '../core/custom-tab/types'
import type { CustomCommand } from '../core/custom-command'

export enum DevToolsEvents {
  DEVTOOLS_STATE_UPDATED = 'devtools:state-updated',
  DEVTOOLS_CONNECTED_UPDATED = 'devtools:connected-updated',
  ROUTER_INFO_UPDATED = 'router-info:updated',
  COMPONENT_STATE_INSPECT = 'component-state:inspect',
  COMPONENT_UPDATED = 'component:updated',
  TOGGLE_COMPONENT_HIGHLIGHTER = 'component-highlighter:toggle',
  GET_COMPONENT_BOUNDING_RECT = 'component-bounding-rect:get',
  SCROLL_TO_COMPONENT = 'scroll-to-component',
  GET_COMPONENT_RENDER_CODE = 'component-render-code:get',
  GET_INSPECTOR_TREE = 'inspector-tree:get',
  SEND_INSPECTOR_TREE = 'inspector-tree:send',
  GET_INSPECTOR_STATE = 'inspector-state:get',
  EDIT_INSPECTOR_STATE = 'inspector-state:edit',
  SEND_INSPECTOR_STATE = 'inspector-state:send',
  VISIT_COMPONENT_TREE = 'component-tree:visit',
  ADD_TIMELINE_EVENT = 'timeline:add-event',
  CUSTOM_TABS_UPDATED = 'custom-tabs:updated',
  CUSTOM_COMMANDS_UPDATED = 'custom-commands:updated',
}

export interface DevToolsEvent {
  // timeline
  [DevToolsEvents.ADD_TIMELINE_EVENT]: (payload: TimelineEvent) => void
  // router
  [DevToolsEvents.ROUTER_INFO_UPDATED]: (routerInfo: RouterInfo) => void
  // highlighter
  [DevToolsEvents.TOGGLE_COMPONENT_HIGHLIGHTER]: (payload: ComponentHighLighterOptions) => void
  [DevToolsEvents.SCROLL_TO_COMPONENT]: (payload: ScrollToComponentOptions) => void
  [DevToolsEvents.GET_COMPONENT_RENDER_CODE]: (id: string) => void
  [DevToolsEvents.GET_COMPONENT_BOUNDING_RECT]: (payload: ComponentBoundingRectApiPayload) => void
  // state
  [DevToolsEvents.DEVTOOLS_STATE_UPDATED]: (state: DevToolsState, oldState: DevToolsState) => void
  [DevToolsEvents.DEVTOOLS_CONNECTED_UPDATED]: (state: DevToolsState, oldState: DevToolsState) => void
  // inspector
  [DevToolsEvents.COMPONENT_STATE_INSPECT]: (payload: {
    componentInstance: VueAppInstance | undefined
    app: VueAppInstance | undefined
    instanceData: InspectorStateApiPayload['state']
  }) => void
  [DevToolsEvents.GET_INSPECTOR_TREE]: (payload: InspectorTreeApiPayload) => void
  [DevToolsEvents.SEND_INSPECTOR_TREE]: (payload: { inspectorId: string, data: InspectorTreeApiPayload['rootNodes'] }) => void
  [DevToolsEvents.GET_INSPECTOR_STATE]: (payload: InspectorStateApiPayload) => void
  [DevToolsEvents.EDIT_INSPECTOR_STATE]: (payload: InspectorStateEditorPayload) => void
  [DevToolsEvents.SEND_INSPECTOR_STATE]: (payload: string) => void
  [DevToolsEvents.VISIT_COMPONENT_TREE]: (payload: {
    componentInstance: VueAppInstance | undefined
    app: VueAppInstance | undefined
    treeNode: ComponentTreeNode
    filter: string
  }) => void
  // custom tabs
  [DevToolsEvents.CUSTOM_TABS_UPDATED]: (payload: CustomTab[]) => void
  // custom command
  [DevToolsEvents.CUSTOM_COMMANDS_UPDATED]: (payload: CustomCommand[]) => void
  [DevToolsEvents.COMPONENT_UPDATED]: () => void
}

export type DevToolsEventParams<T extends keyof DevToolsEvent> = Parameters<DevToolsEvent[T]>

export const apiHooks: Hookable<DevToolsEvent, HookKeys<DevToolsEvent>> = target.__VUE_DEVTOOLS_API_HOOK ??= createHooks<DevToolsEvent>()
