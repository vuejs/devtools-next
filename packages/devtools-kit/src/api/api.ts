import { TimelineLayerItem, addTimelineLayer } from '../core/timeline'
import { InspectorApiPayload, addInspector, getInspector, updateInspector } from '../core/inspector'
import { toggleActiveAppRecord } from '../core/app-record'
import type { VueAppInstance } from '../types'
import { highlight as highlightElement, inspectComponentHighLighter, scrollToComponent, toggleComponentHighLighter, unhighlight as unhighlightElement } from '../core/component-highlighter'
import { devtoolsContext } from '../state'
import { now as nowFn, parse, stringify } from '../shared'
import { StateEditor } from '../core/component/state/editor'
import type { InspectorStateEditorPayload } from '../core/component/types'
import { addCustomTab } from '../core/custom-tab'
import type { CustomTab } from '../core/custom-tab/types'
import { addCustomCommand, removeCustomCommand } from '../core/custom-command'
import type { CustomCommand } from '../core/custom-command'
import { getComponentInspector } from '../core/component-inspector'
import type { OpenInEditorOptions } from '../core/open-in-editor'
import { openInEditor } from '../core/open-in-editor'

import { DevToolsEventParams, DevToolsEvents, apiHooks } from './hook'
import { on } from './on'
import { remove } from './off'

export { collectDevToolsPlugin } from './plugin'

export class DevToolsPluginApi {
  public on: typeof on
  public clear = remove
  constructor() {
    this.on = on
  }

  // #region compatible with old devtools

  // timeline layer
  addTimelineLayer(payload: TimelineLayerItem) {
    addTimelineLayer(payload)
  }

  // timeline event
  addTimelineEvent(...params: DevToolsEventParams<DevToolsEvents.ADD_TIMELINE_EVENT>) {
    apiHooks.callHook(DevToolsEvents.ADD_TIMELINE_EVENT, ...params)
  }

  // add inspector
  addInspector(payload: InspectorApiPayload) {
    addInspector({
      id: payload.id,
      nodeId: '',
      filter: '',
      treeFilterPlaceholder: payload.treeFilterPlaceholder || '',
    })
  }

  highlightElement(instance: VueAppInstance) {
    highlightElement(instance)
  }

  unhighlightElement() {
    unhighlightElement()
  }

  // inspector

  async getInspectorTree(payload: DevToolsEventParams<DevToolsEvents.GET_INSPECTOR_TREE>[0] = {}) {
    const { inspectorId, filter = '', instanceId = '' } = payload
    const _payload = {
      app: devtoolsContext.appRecord?.app,
      inspectorId,
      instanceId,
      filter,
      rootNodes: [],
    }

    updateInspector(inspectorId!, {
      filter,
    })

    await new Promise<void>((resolve) => {
      // @ts-expect-error hookable
      apiHooks.callHookWith(async (callbacks) => {
        await Promise.all(callbacks.map(cb => cb(_payload)))
        resolve()
      }, DevToolsEvents.GET_INSPECTOR_TREE)
    })

    return stringify(_payload.rootNodes) as string
  }

  getInspectorState(payload: { inspectorId?: string, nodeId?: string } = {}) {
    const { inspectorId, nodeId } = payload
    const _payload = {
      app: devtoolsContext.appRecord?.app,
      inspectorId,
      nodeId,
    }

    updateInspector(inspectorId!, {
      nodeId,
    })
    // @ts-expect-error hookable
    apiHooks.callHookWith((callbacks) => {
      callbacks.forEach(cb => cb(_payload))
    }, DevToolsEvents.GET_INSPECTOR_STATE)

    // @ts-expect-error TODO: types
    const state = _payload.state

    delete state.instance
    return stringify(state) as string
  }

  async editInspectorState(payload: InspectorStateEditorPayload) {
    const stateEditor = new StateEditor()
    apiHooks.callHook(DevToolsEvents.EDIT_INSPECTOR_STATE, {
      ...payload,
      app: devtoolsContext.appRecord?.app,
      set: (obj, path = payload.path, value = payload.state.value, cb) => {
        stateEditor.set(obj, path, value, cb || stateEditor.createDefaultSetCallback(payload.state))
      },
    })
  }

  async sendInspectorTree(inspectorId: string) {
    const inspector = getInspector(inspectorId)
    if (inspector) {
      const res = await this.getInspectorTree({
        inspectorId,
      })
      apiHooks.callHook(DevToolsEvents.SEND_INSPECTOR_TREE, stringify({
        inspectorId,
        data: parse(res),
      }) as string)
    }
  }

  async sendInspectorState(inspectorId: string) {
    const inspector = getInspector(inspectorId)
    if (inspector && inspector.nodeId) {
      const res = await this.getInspectorState({
        inspectorId,
        nodeId: inspector.nodeId,
      })
      apiHooks.callHook(DevToolsEvents.SEND_INSPECTOR_STATE, stringify({ ...parse(res), inspectorId }) as string)
    }
  }

  async getComponentInstances(app: VueAppInstance) {
    const appRecord = app.__VUE_DEVTOOLS_APP_RECORD__
    const appId = appRecord.id.toString()
    const instances = [...appRecord.instanceMap]
      .filter(([key]) => key.split(':')[0] === appId)
      .map(([,instance]) => instance)
    return instances
  }

  visitComponentTree(...params: DevToolsEventParams<DevToolsEvents.VISIT_COMPONENT_TREE>) {
    apiHooks.callHook(DevToolsEvents.VISIT_COMPONENT_TREE, ...params)
  }

  notifyComponentUpdate() {
    apiHooks.callHook(DevToolsEvents.COMPONENT_UPDATED)
  }

  now() {
    return nowFn()
  }

  getSettings() {
    return {
      logStoreChanges: null,
    }
  }

  // #endregion compatible with old devtools

  //  #region highlighter
  toggleComponentInspector(...params: DevToolsEventParams<DevToolsEvents.TOGGLE_COMPONENT_HIGHLIGHTER>) {
    return toggleComponentHighLighter(...params)
  }

  inspectComponentInspector() {
    return inspectComponentHighLighter()
  }

  scrollToComponent(...params: DevToolsEventParams<DevToolsEvents.SCROLL_TO_COMPONENT>) {
    return scrollToComponent(...params)
  }

  getComponentBoundingRect(...params: DevToolsEventParams<DevToolsEvents.GET_COMPONENT_BOUNDING_RECT>) {
    const { inspectorId, instanceId = '' } = params[0]
    const _payload = {
      app: devtoolsContext.appRecord?.app,
      inspectorId,
      instanceId,
      rect: {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
      },
    }
    // @ts-expect-error hookable
    apiHooks.callHookWith((callbacks) => {
      callbacks.map(cb => cb(_payload))
    }, DevToolsEvents.GET_COMPONENT_BOUNDING_RECT)
    return stringify(_payload.rect) as string
  }

  // #endregion highlighter

  toggleApp(id: string) {
    return toggleActiveAppRecord(id)
  }

  addCustomTab(tab: CustomTab) {
    addCustomTab(tab)
  }

  addCustomCommand(action: CustomCommand) {
    addCustomCommand(action)
  }

  removeCustomCommand(actionId: CustomCommand['id']) {
    removeCustomCommand(actionId)
  }

  openInEditor(payload: OpenInEditorOptions) {
    openInEditor(payload)
  }

  getVueInspector() {
    return getComponentInspector()
  }
}
