import type { InspectorNodeTag, InspectorState, RouterInfo, TimelineEvent } from 'vue-devtools-kit'
import { parse } from 'vue-devtools-kit/shared'
import type { ViteHotContext } from 'vite-hot-client'
import { setupViteRPCClient } from '../vite-rpc'
import { BridgeEvents } from './types'
import type { BridgeInstanceType, BridgeRpcEventPayload } from './core'
import { BridgeRpcCore, bridgeRpcEvents } from './core'

const devtoolsBridge: {
  value: BridgeInstanceType
  viteRpc: {
    enabled: boolean
    api: ReturnType<typeof setupViteRPCClient>
  }
  rpc: InstanceType<typeof BridgeRpcCore>
} = {
  value: null!,
  viteRpc: {
    enabled: false,
    api: null!,
  },
  rpc: null!,
}

export interface BridgeRpcOptions {
  viteRPCContext?: ViteHotContext | undefined
  bridge: BridgeInstanceType
}
export function registerBridgeRpc(options: BridgeRpcOptions) {
  const rpc = setupViteRPCClient(options.viteRPCContext)
  devtoolsBridge.value = options.bridge
  devtoolsBridge.rpc = new BridgeRpcCore(options.bridge)
  if (rpc) {
    devtoolsBridge.viteRpc = {
      enabled: true,
      api: rpc,
    }
  }
}

export class BridgeRpc {
  static on = {
    inspectorTreeUpdated<T = { inspectorId: string, data: { id: string, label: string, tags: InspectorNodeTag[] }[] } >(cb: (payload: T) => void, options: { inspectorId: string }) {
      devtoolsBridge.value.on(BridgeEvents.SEND_INSPECTOR_TREE, (payload) => {
        const _payload = parse(payload)
        options.inspectorId === _payload.inspectorId && cb(_payload)
      })
    },
    inspectorStateUpdated<T = { inspectorId: string, state: InspectorState[] }>(cb: (payload: T) => void, options: { inspectorId: string }) {
      devtoolsBridge.value.on(BridgeEvents.SEND_INSPECTOR_STATE, (payload) => {
        const _payload = parse(payload)
        options.inspectorId === _payload.inspectorId && cb({
          state: _payload.state,
        } as T)
      })
    },
    devtoolsStateUpdated(cb) {
      devtoolsBridge.value.on(BridgeEvents.DEVTOOLS_STATE_UPDATED, (payload) => {
        cb(parse(payload))
      })
    },
    routerInfoUpdated(cb: (payload: RouterInfo) => void) {
      devtoolsBridge.value.on(BridgeEvents.ROUTER_INFO_UPDATED, (payload) => {
        cb(parse(payload))
      })
    },
    addTimelineEvent(cb: (payload: TimelineEvent) => void) {
      devtoolsBridge.value.on(BridgeEvents.ADD_TIMELINE_EVENT, (payload) => {
        cb(parse(payload))
      })
    },
  }

  static updateInspectorTreeId(id: string) {
    devtoolsBridge.rpc.emit(bridgeRpcEvents.updateInspectorTreeId, id)
  }

  static async getInspectorTree<R extends { data: unknown[] } = { data: { id: string, label: string, tags: InspectorNodeTag[] }[] }>(payload: BridgeRpcEventPayload['inspector-tree']) {
    return devtoolsBridge.rpc.emit<R>(bridgeRpcEvents.inspectorTree, payload)
  }

  static async getInspectorState<R extends { data: unknown } = { data: { state: InspectorState[] } }>(payload: BridgeRpcEventPayload['inspector-state']) {
    return devtoolsBridge.rpc.emit<R>(bridgeRpcEvents.inspectorState, payload)
  }

  static async editInspectorState<R extends { data: unknown } = { data: { state: InspectorState[] } }>(payload: BridgeRpcEventPayload['edit-inspector-state']) {
    return devtoolsBridge.rpc.emit<R>(bridgeRpcEvents.editState, payload)
  }

  static async getDevToolsState() {
    return devtoolsBridge.rpc.emit<{ data: { connected: boolean, vueVersion: string } }>(bridgeRpcEvents.state)
  }

  static async getTimelineLayer() {
    return devtoolsBridge.rpc.emit<{ data: { id: string, label: string, color: number }[] }>(bridgeRpcEvents.timelineLayer)
  }

  static async getRouterInfo() {
    return devtoolsBridge.rpc.emit<{ data: RouterInfo }>(bridgeRpcEvents.routerInfo)
  }

  static async navigate(payload: Record<string, string>): Promise<void> {
    return devtoolsBridge.rpc.emit<void>(bridgeRpcEvents.router, JSON.stringify(payload))
  }

  static async getMatchedRoutes(path: string) {
    return devtoolsBridge.rpc.emit<{ data: { path: string }[] }>(bridgeRpcEvents.routeMatched, path)
  }

  // assets
  static getStaticAssets() {
    return devtoolsBridge.viteRpc!.api!.getStaticAssets()
  }

  static getImageMeta(filepath: string) {
    return devtoolsBridge.viteRpc!.api!.getImageMeta(filepath)
  }

  static getTextAssetContent(filepath: string, limit = 300) {
    return devtoolsBridge.viteRpc!.api!.getTextAssetContent(filepath, limit)
  }

  static root() {
    return devtoolsBridge.viteRpc.api.root()
  }

  // graph
  static getGraph() {
    return devtoolsBridge.viteRpc!.api!.getGraph()
  }
}
