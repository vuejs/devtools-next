import { DevToolsEvents, apiHooks } from './hook'
import type { DevToolsEvent } from './hook'

export const on = {
  addTimelineEvent(fn: DevToolsEvent[DevToolsEvents.ADD_TIMELINE_EVENT]) {
    apiHooks.hook(DevToolsEvents.ADD_TIMELINE_EVENT, fn)
  },

  routerInfoUpdated(fn: DevToolsEvent[DevToolsEvents.ROUTER_INFO_UPDATED]) {
    apiHooks.hook(DevToolsEvents.ROUTER_INFO_UPDATED, fn)
  },
} as const
