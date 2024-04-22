import { DevToolsEvents, apiHooks, registerInstanceHook } from './hook'
import type { DevToolsEvent } from './hook'

export const on = {
  // #region compatible with old devtools
  addTimelineEvent(fn: DevToolsEvent[DevToolsEvents.ADD_TIMELINE_EVENT]) {
    registerInstanceHook(DevToolsEvents.ADD_TIMELINE_EVENT, fn)
  },
  inspectComponent(fn: DevToolsEvent[DevToolsEvents.COMPONENT_STATE_INSPECT]) {
    registerInstanceHook(DevToolsEvents.COMPONENT_STATE_INSPECT, fn)
  },
  visitComponentTree(fn: DevToolsEvent[DevToolsEvents.VISIT_COMPONENT_TREE]) {
    registerInstanceHook(DevToolsEvents.VISIT_COMPONENT_TREE, fn)
  },
  getInspectorTree(fn: DevToolsEvent[DevToolsEvents.GET_INSPECTOR_TREE]) {
    registerInstanceHook(DevToolsEvents.GET_INSPECTOR_TREE, fn)
  },
  getInspectorState(fn: DevToolsEvent[DevToolsEvents.GET_INSPECTOR_STATE]) {
    registerInstanceHook(DevToolsEvents.GET_INSPECTOR_STATE, fn)
  },
  sendInspectorTree(fn: DevToolsEvent[DevToolsEvents.SEND_INSPECTOR_TREE]) {
    registerInstanceHook(DevToolsEvents.SEND_INSPECTOR_TREE, fn)
  },
  sendInspectorState(fn: DevToolsEvent[DevToolsEvents.SEND_INSPECTOR_STATE]) {
    registerInstanceHook(DevToolsEvents.SEND_INSPECTOR_STATE, fn)
  },
  editInspectorState(fn: DevToolsEvent[DevToolsEvents.EDIT_INSPECTOR_STATE]) {
    registerInstanceHook(DevToolsEvents.EDIT_INSPECTOR_STATE, fn)
  },
  editComponentState() {},
  componentUpdated(fn: DevToolsEvent[DevToolsEvents.COMPONENT_UPDATED]) {
    registerInstanceHook(DevToolsEvents.COMPONENT_UPDATED, fn)
  },
  // #endregion compatible with old devtools

  // router
  routerInfoUpdated(fn: DevToolsEvent[DevToolsEvents.ROUTER_INFO_UPDATED]) {
    registerInstanceHook(DevToolsEvents.ROUTER_INFO_UPDATED, fn)
  },

  // component highlighter
  getComponentBoundingRect(fn: DevToolsEvent[DevToolsEvents.GET_COMPONENT_BOUNDING_RECT]) {
    registerInstanceHook(DevToolsEvents.GET_COMPONENT_BOUNDING_RECT, fn)
  },

  // custom tabs
  customTabsUpdated(fn: DevToolsEvent[DevToolsEvents.CUSTOM_TABS_UPDATED]) {
    registerInstanceHook(DevToolsEvents.CUSTOM_TABS_UPDATED, fn)
  },

  // custom commands
  customCommandsUpdated(fn: DevToolsEvent[DevToolsEvents.CUSTOM_COMMANDS_UPDATED]) {
    registerInstanceHook(DevToolsEvents.CUSTOM_COMMANDS_UPDATED, fn)
  },

  devtoolsStateUpdated(fn: DevToolsEvent[DevToolsEvents.DEVTOOLS_STATE_UPDATED]) {
    apiHooks.hook(DevToolsEvents.DEVTOOLS_STATE_UPDATED, fn)
  },
} as const
