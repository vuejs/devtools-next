import type { HookKeys, Hookable } from 'hookable'
import { target } from '@vue/devtools-shared'
import { createHooks } from 'hookable'
import type { TimelineEvent } from '../core/timeline'
import type { RouterInfo } from '../types'

export enum DevToolsEvents {
  DEVTOOLS_STATE_UPDATED = 'devtools:state-updated',
  DEVTOOLS_CONNECTED_UPDATED = 'devtools:connected-updated',
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
  CUSTOM_COMMANDS_UPDATED = 'custom-commands:updated',
}

export interface DevToolsEvent {
  [DevToolsEvents.ADD_TIMELINE_EVENT]: (payload: TimelineEvent) => void
  [DevToolsEvents.ROUTER_INFO_UPDATED]: (routerInfo: RouterInfo) => void
}

export type DevToolsEventParams<T extends keyof DevToolsEvent> = Parameters<DevToolsEvent[T]>

export const apiHooks: Hookable<DevToolsEvent, HookKeys<DevToolsEvent>> = target.__VUE_DEVTOOLS_API_HOOK ??= createHooks<DevToolsEvent>()
