import type { InspectorNodeTag, InspectorState, TimelineEvent } from 'vue-devtools-kit'
import { parse } from 'vue-devtools-kit/shared'
import { BridgeEvents } from './types'
import type { BridgeRpcEventPayload } from './core'
import { Bridge, bridgeRpcCore, bridgeRpcEvents } from './core'

export function registerBridgeRpc() {

}

export class BridgeRpc {
  static on = {
    inspectorTreeUpdated<T = { inspectorId: string; data: { id: string; label: string; tags: InspectorNodeTag[] }[] } >(cb: (payload: T) => void) {
      Bridge.value.on(BridgeEvents.SEND_INSPECTOR_TREE, (payload) => {
        cb(parse(payload))
      })
    },
    inspectorStateUpdated<T = { inspectorId: string; state: Record<string, InspectorState[]> }>(cb: (payload: T) => void) {
      Bridge.value.on(BridgeEvents.SEND_INSPECTOR_STATE, (payload) => {
        cb(parse(payload))
      })
    },
    devtoolsStateUpdated(cb) {
      Bridge.value.on(BridgeEvents.DEVTOOLS_STATE_UPDATED, (payload) => {
        cb(parse(payload))
      })
    },
    addTimelineEvent(cb: (payload: TimelineEvent) => void) {
      Bridge.value.on(BridgeEvents.ADD_TIMELINE_EVENT, (payload) => {
        cb(parse(payload))
      })
    },
  }

  static async getInspectorTree<R extends { data: unknown[] } = { data: { id: string; label: string; tags: InspectorNodeTag[] }[] }>(payload: BridgeRpcEventPayload['inspector-tree']) {
    return bridgeRpcCore.emit<R>(bridgeRpcEvents.inspectorTree, payload)
  }

  static async getInspectorState<R extends { data: unknown } = { data: { state: Record<string, InspectorState[]> } }>(payload: BridgeRpcEventPayload['inspector-state']) {
    return bridgeRpcCore.emit<R>(bridgeRpcEvents.inspectorState, payload)
  }

  static async getDevToolsState() {
    return bridgeRpcCore.emit<{ data: { connected: boolean;vueVersion: string } }>(bridgeRpcEvents.state)
  }

  static async getTimelineLayer() {
    return bridgeRpcCore.emit<{ data: { id: string;label: string; color: number }[] }>(bridgeRpcEvents.timelineLayer)
  }
}
