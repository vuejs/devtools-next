import { devtoolsContext } from '../core/general/state'
import { stringify } from '../shared'
import type { AddInspectorApiPayload } from '../core/component/types'
import { addInspector, getInspector, updateInspector } from '../core/general/inspector'
import { addTimelineLayer } from '../core/timeline'
import type { DevToolsEvent } from './on'
import { DevToolsEvents, apiHooks, on } from './on'

export { DevToolsEvents, apiHooks } from './on'
export * from './plugin'

export class DevToolsPluginApi {
  public on: typeof on
  constructor() {
    this.on = on
  }

  addTimelineEvent() {}
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

  getInspectorState(payload: { inspectorId?: string; nodeId?: string } = {}) {
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
    return stringify(_payload) as string
  }

  async sendInspectorTree(inspectorId: string) {
    const inspector = getInspector(inspectorId)
    if (inspector) {
      const res = await this.getInspectorTree({
        inspectorId,
      })
      apiHooks.callHook(DevToolsEvents.SEND_INSPECTOR_TREE, res)
    }
  }

  async sendInspectorState(inspectorId: string) {
    const inspector = getInspector(inspectorId)
    if (inspector) {
      const res = await this.getInspectorState({
        inspectorId,
        nodeId: inspector.nodeId,
      })

      apiHooks.callHook(DevToolsEvents.SEND_INSPECTOR_STATE, res)
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

  visitComponentTree(payload: Parameters<DevToolsEvent[DevToolsEvents.VISIT_COMPONENT_TREE]>[0]) {
    apiHooks.callHook(DevToolsEvents.VISIT_COMPONENT_TREE, payload)
  }

  addTimelineLayer(payload: { id: string; label: string; color: number }) {
    addTimelineLayer(payload)
  }

  notifyComponentUpdate() {}
  now() {}
  getSettings() {
    return {
      logStoreChanges: null,
    }
  }
}
