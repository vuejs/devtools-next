import type { AppRecord, DevToolsPluginInspectorState } from '@vue-devtools-next/schema'
import { getInstanceState } from '../core/component/state'
import { getComponentTree } from '../core/component/tree'
import { devtoolsContext } from '../core/general/state'
import { stringify } from '../shared'
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
  getInspectorTree(payload: { inspectorId?: string; filter?: string } = {}) {
    const { inspectorId, filter = '' } = payload
    const _payload = {
      app: devtoolsContext.appRecord.app,
      inspectorId,
      filter,
      rootNodes: [],
    }

    // @ts-expect-error hookable
    apiHooks.callHookWith((callbacks) => {
      callbacks.forEach(cb => cb(_payload))
    }, DevToolsEvents.GET_INSPECTOR_TREE)
    return stringify(_payload.rootNodes) as string
  }

  getInspectorState(payload: { inspectorId?: string; nodeId?: string } = {}) {
    const { inspectorId, nodeId } = payload
    const _payload = {
      app: devtoolsContext.appRecord.app,
      inspectorId,
      nodeId,
    }

    // @ts-expect-error hookable
    apiHooks.callHookWith((callbacks) => {
      callbacks.forEach(cb => cb(_payload))
    }, DevToolsEvents.GET_INSPECTOR_STATE)
    return stringify(_payload) as string
  }

  sendInspectorTree() {}
  sendInspectorState() {}
  addInspector(state: DevToolsPluginInspectorState) {
    // @TODO: register inspector and use to judge if pinia and router is used
    // console.log('state', state)
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
