import { devtoolsContext } from '../core/general/state'
import { now as nowFn, parse, stringify } from '../shared'
import type { AddInspectorApiPayload, InspectorStateEditorPayload } from '../core/component/types'
import { addInspector, getInspector, updateInspector } from '../core/general/inspector'
import type { TimelineEvent } from '../core/timeline'
import { addTimelineLayer } from '../core/timeline'
import { StateEditor } from '../core/component/state/editor'
import { openInEditor } from '../core/open-in-editor'
import type { OpenInEditorOptions } from '../core/open-in-editor'
import { getVueInspector } from '../core/vue-inspector'
import { inspectComponentInspector, scrollToComponent, toggleComponentInspector } from '../core/component-inspector'
import type { DevToolsEvent } from './on'
import { DevToolsEvents, apiHooks, on } from './on'

export { DevToolsEvents, apiHooks } from './on'
export * from './plugin'

export class DevToolsPluginApi {
  public on: typeof on
  constructor() {
    this.on = on
  }

  addTimelineEvent(payload: TimelineEvent) {
    apiHooks.callHook(DevToolsEvents.ADD_TIMELINE_EVENT, payload)
  }

  toggleComponentInspector(payload: Parameters<DevToolsEvent[DevToolsEvents.TOGGLE_COMPONENT_INSPECTOR]>[0]) {
    return toggleComponentInspector(payload)
  }

  inspectComponentInspector() {
    return inspectComponentInspector()
  }

  scrollToComponent(payload: Parameters<DevToolsEvent[DevToolsEvents.SCROLL_TO_COMPONENT]>[0]) {
    return scrollToComponent(payload)
  }

  getComponentBoundingRect(payload: Parameters<DevToolsEvent[DevToolsEvents.GET_COMPONENT_BOUNDING_RECT]>[0]) {
    const { inspectorId, instanceId = '' } = payload
    const _payload = {
      app: devtoolsContext.appRecord.app,
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

  async getInspectorTree(payload: Parameters<DevToolsEvent[DevToolsEvents.GET_INSPECTOR_TREE]>[0] = {}) {
    const { inspectorId, filter = '', instanceId = '' } = payload
    const _payload = {
      app: devtoolsContext.appRecord.app,
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
      app: devtoolsContext.appRecord.app,
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
      app: devtoolsContext.appRecord.app,
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

  addInspector(payload: AddInspectorApiPayload) {
    addInspector({
      id: payload.id,
      nodeId: '',
      filter: '',
      treeFilterPlaceholder: payload.treeFilterPlaceholder ?? '',
    })
  }

  openInEditor(payload: OpenInEditorOptions) {
    openInEditor(payload)
  }

  // Vite only
  getVueInspector() {
    return getVueInspector()
  }

  visitComponentTree(payload: Parameters<DevToolsEvent[DevToolsEvents.VISIT_COMPONENT_TREE]>[0]) {
    apiHooks.callHook(DevToolsEvents.VISIT_COMPONENT_TREE, payload)
  }

  addTimelineLayer(payload: { id: string, label: string, color: number }) {
    addTimelineLayer(payload)
  }

  notifyComponentUpdate() {}
  now() {
    return nowFn()
  }

  getSettings() {
    return {
      logStoreChanges: null,
    }
  }
}
