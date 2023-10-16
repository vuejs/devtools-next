import type { AppRecord } from '@vue-devtools-next/schema'
import { getInstanceState } from '../core/component/state'
import { getComponentTree } from '../core/component/tree'
import { emit } from './emit'
import { on } from './on'

export { DevToolsEvents, callBuffer } from './on'
export * from './plugin'
export const api = {
  on,
  ...emit,
}

export class DevToolsPluginApi {
  public on: typeof on
  constructor() {
    this.on = on
  }

  getInstanceState(params: { instanceId: string }) {
    return getInstanceState(params)
  }

  getComponentTree(options: { appRecord?: AppRecord; instanceId?: string ;filterText?: string; maxDepth?: number; recursively?: boolean }) {
    return getComponentTree(options)
  }

  addTimelineEvent() {}
  getInspectorTree() {}
  sendInspectorTree() {}
  getInspectorState() {}
  sendInspectorState() {}
  addInspector() {}
  addTimelineLayer() {}
  notifyComponentUpdate() {}
  now() {}
  getSettings() {
    return {
      logStoreChanges: null,
    }
  }
}
