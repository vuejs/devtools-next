import type { InspectorNodeTag, InspectorState, RouterInfo, TimelineEvent } from 'vue-devtools-kit'
import { parse } from 'vue-devtools-kit/shared'
import type { ViteHotContext } from 'vite-hot-client'
import { setupViteRPCClient } from '../vite-rpc'
import { BridgeEvents } from './types'
import type { BridgeRpcEventPayload } from './core'
import { Bridge, bridgeRpcCore, bridgeRpcEvents } from './core'

const viteRpc: {
  enabled: boolean
  api: ReturnType<typeof setupViteRPCClient> | null
} = {
  enabled: false,
  api: null,
}

export interface BridgeRpcOptions {
  viteRPCContext?: ViteHotContext | undefined
}
export function registerBridgeRpc(options: BridgeRpcOptions) {
  const rpc = setupViteRPCClient(options.viteRPCContext)
  if (rpc) {
    viteRpc.enabled = true
    viteRpc.api = rpc
  }
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
    routerInfoUpdated(cb: (payload: RouterInfo) => void) {
      Bridge.value.on(BridgeEvents.ROUTER_INFO_UPDATED, (payload) => {
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

  static async getRouterInfo() {
    return bridgeRpcCore.emit<{ data: RouterInfo }>(bridgeRpcEvents.routerInfo)
  }

  static async navigate(payload: Record<string, string>): Promise<void> {
    return bridgeRpcCore.emit<void>(bridgeRpcEvents.router, JSON.stringify(payload))
  }

  static async getMatchedRoutes(path: string) {
    return bridgeRpcCore.emit<{ data: { path: string }[] }>(bridgeRpcEvents.routeMatched, path)
  }
}
