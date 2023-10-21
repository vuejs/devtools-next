import type { AppRecord, DevToolsPluginInspectorPayload } from '@vue-devtools-next/schema'
import { getInstanceState } from '../core/component/state'
import { getComponentTree } from '../core/component/tree'
import { devtoolsContext } from '../core/general/state'
import { stringify } from '../shared'
import { addInspector, getInspector, updateInspector } from '../core/general/inspector'
import { DevToolsEvents, apiHooks, on } from './on'

export { DevToolsEvents, apiHooks } from './on'
export * from './plugin'

export class DevToolsPluginApi {
  public on: typeof on
  constructor() {
    this.on = on
  }

  getInstanceState(params: { instanceId: string }) {
    const result = getInstanceState(params)
    const componentInstance = result.instance
    const app = result.instance?.appContext.app
    const payload = {
      componentInstance,
      app,
      instanceData: result,
    }
    // @ts-expect-error hookable
    apiHooks.callHookWith((callbacks) => {
      callbacks.forEach(cb => cb(payload))
    }, DevToolsEvents.COMPONENT_STATE_INSPECT)
    return stringify(result) as string
  }

  getComponentTree(payload: { appRecord?: AppRecord; instanceId?: string ;filterText?: string; maxDepth?: number; recursively?: boolean }) {
    return getComponentTree(payload)
  }

  addTimelineEvent() {}
  async getInspectorTree(payload: { inspectorId?: string; filter?: string; instanceId?: string } = {}) {
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
        instanceId: inspector.nodeId,
      })
      apiHooks.callHook(DevToolsEvents.SEND_INSPECTOR_STATE, res)
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

  addInspector(payload: DevToolsPluginInspectorPayload) {
    addInspector({
      id: payload.id,
      nodeId: '',
      filter: '',
      treeFilterPlaceholder: payload.treeFilterPlaceholder ?? '',
    })
  }

  addTimelineLayer() {}
  notifyComponentUpdate() {}
  now() {}
  getSettings() {
    return {
      logStoreChanges: null,
    }
  }
}
