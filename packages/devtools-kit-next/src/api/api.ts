import { TimelineLayerItem, addTimelineLayer } from '../core/timeline'
import { InspectorApiPayload, addInspector } from '../core/inspector'
import { DevToolsEventParams, DevToolsEvents, apiHooks } from './hook'
import { on } from './on'

export { collectDevToolsPlugin } from './plugin'

export class DevToolsPluginApi {
  public on: typeof on
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
      nodeId: payload.id,
      filter: '',
      treeFilterPlaceholder: payload.treeFilterPlaceholder || '',
    })
  }

  // #endregion compatible with old devtools
}
