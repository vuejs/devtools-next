import { DevToolsEvents, apiHooks } from './hook'
import type { DevToolsEvent } from './hook'

export const on = {
  // #region compatible with old devtools
  addTimelineEvent(fn: DevToolsEvent[DevToolsEvents.ADD_TIMELINE_EVENT]) {
    apiHooks.hook(DevToolsEvents.ADD_TIMELINE_EVENT, fn)
  },
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
  sendInspectorTree(fn: DevToolsEvent[DevToolsEvents.SEND_INSPECTOR_TREE]) {
    apiHooks.hook(DevToolsEvents.SEND_INSPECTOR_TREE, fn)
  },
  sendInspectorState(fn: DevToolsEvent[DevToolsEvents.SEND_INSPECTOR_STATE]) {
    apiHooks.hook(DevToolsEvents.SEND_INSPECTOR_STATE, fn)
  },
  editInspectorState(fn: DevToolsEvent[DevToolsEvents.EDIT_INSPECTOR_STATE]) {
    apiHooks.hook(DevToolsEvents.EDIT_INSPECTOR_STATE, fn)
  },
  editComponentState() {},
  componentUpdated(fn: DevToolsEvent[DevToolsEvents.COMPONENT_UPDATED]) {
    apiHooks.hook(DevToolsEvents.COMPONENT_UPDATED, fn)
  },
  // #endregion compatible with old devtools

  // router
  routerInfoUpdated(fn: DevToolsEvent[DevToolsEvents.ROUTER_INFO_UPDATED]) {
    apiHooks.hook(DevToolsEvents.ROUTER_INFO_UPDATED, fn)
  },

  // component highlighter
  getComponentBoundingRect(fn: DevToolsEvent[DevToolsEvents.GET_COMPONENT_BOUNDING_RECT]) {
    apiHooks.hook(DevToolsEvents.GET_COMPONENT_BOUNDING_RECT, fn)
  },

  // custom tabs
  customTabsUpdated(fn: DevToolsEvent[DevToolsEvents.CUSTOM_TABS_UPDATED]) {
    apiHooks.hook(DevToolsEvents.CUSTOM_TABS_UPDATED, fn)
  },

  // custom commands
  customCommandsUpdated(fn: DevToolsEvent[DevToolsEvents.CUSTOM_COMMANDS_UPDATED]) {
    apiHooks.hook(DevToolsEvents.CUSTOM_COMMANDS_UPDATED, fn)
  },

  devtoolsStateUpdated(fn: DevToolsEvent[DevToolsEvents.DEVTOOLS_STATE_UPDATED]) {
    apiHooks.hook(DevToolsEvents.DEVTOOLS_STATE_UPDATED, fn)
  },
} as const
