import type { CustomCommand, CustomTab, InspectorNodeTag, InspectorState, OpenInEditorOptions, RouterInfo, TimelineEvent } from '@vue/devtools-kit'
import { parse } from '@vue/devtools-kit'
import type { DevtoolsBridgeAppRecord } from '../vue-plugin'

import { BridgeEvents } from './types'
import type { BridgeInstanceType, BridgeRpcEventPayload } from './core'
import { BridgeRpcCore, bridgeRpcEvents } from './core'

const devtoolsBridge: {
  value: BridgeInstanceType
  rpc: InstanceType<typeof BridgeRpcCore>
} = {
  value: null!,
  rpc: null!,
}

export interface BridgeRpcOptions {
  bridge: BridgeInstanceType
}
export function registerBridgeRpc(options: BridgeRpcOptions) {
  devtoolsBridge.value = options.bridge
  devtoolsBridge.rpc = new BridgeRpcCore(options.bridge)
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
          getters: _payload.getters,
        } as T)
      })
    },
    componentUpdated(cb: (id?: string) => void, options: { inspectorId: string }) {
      devtoolsBridge.value.on(BridgeEvents.COMPONENT_UPDATED, () => {
        cb(options?.inspectorId)
      })
    },
    devtoolsStateUpdated(cb) {
      devtoolsBridge.value.on(BridgeEvents.DEVTOOLS_STATE_UPDATED, (payload) => {
        cb(parse(payload))
      })
    },
    customTabsUpdated(cb: (payload: CustomTab[]) => void) {
      devtoolsBridge.value.on(BridgeEvents.CUSTOM_TABS_UPDATED, (payload) => {
        cb(parse(payload))
      })
    },
    customCommandsUpdated(cb: (payload: CustomCommand[]) => void) {
      devtoolsBridge.value.on(BridgeEvents.CUSTOM_COMMANDS_UPDATED, (payload) => {
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

  static toggleComponentInspector(payload: BridgeRpcEventPayload['toggle-component-inspector']) {
    devtoolsBridge.rpc.emit(bridgeRpcEvents.toggleComponentInspector, payload)
  }

  static inspectComponentInspector() {
    return devtoolsBridge.rpc.emit<{ data: { id: string } }>(bridgeRpcEvents.inspectComponentInspector)
  }

  static unhighlightElement() {
    return devtoolsBridge.rpc.emit(bridgeRpcEvents.unhighlightElement)
  }

  static scrollToComponent(payload: BridgeRpcEventPayload['scroll-to-component']) {
    return devtoolsBridge.rpc.emit(bridgeRpcEvents.scrollToComponent, payload)
  }

  static async getComponentBoundingRect<R extends { data: unknown } = { data: { top: number, left: number, width: number, height: number } }>(payload: BridgeRpcEventPayload['component-bounding-rect']) {
    return devtoolsBridge.rpc.emit<R>(bridgeRpcEvents.componentBoundingRect, payload)
  }

  static getInspectorTree<R extends { data: unknown[] } = { data: { id: string, label: string, tags: InspectorNodeTag[] }[] }>(payload: BridgeRpcEventPayload['inspector-tree']) {
    return devtoolsBridge.rpc.emit<R>(bridgeRpcEvents.inspectorTree, payload)
  }

  static async getInspectorState<R extends { data: unknown } = { data: { state: InspectorState[] } }>(payload: BridgeRpcEventPayload['inspector-state']) {
    return devtoolsBridge.rpc.emit<R>(bridgeRpcEvents.inspectorState, payload)
  }

  static async editInspectorState<R extends { data: unknown } = { data: { state: InspectorState[] } }>(payload: BridgeRpcEventPayload['edit-inspector-state']) {
    return devtoolsBridge.rpc.emit<R>(bridgeRpcEvents.editState, payload)
  }

  static async getDevToolsState() {
    return devtoolsBridge.rpc.emit<{ data: { connected: boolean, clientConnected: boolean, vueVersion: string, tabs: CustomTab[], commands: CustomCommand[], vitePluginDetected: boolean, appRecords: Array<DevtoolsBridgeAppRecord>, activeAppRecordId: string } }>(bridgeRpcEvents.state)
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

  static async openInEditor(payload: OpenInEditorOptions) {
    return devtoolsBridge.rpc.emit<void>(bridgeRpcEvents.openInEditor, JSON.stringify(payload))
  }

  static async isVueInspectorDetected() {
    return devtoolsBridge.rpc.emit<{ data: boolean }>(bridgeRpcEvents.isVueInspectorDetected)
  }

  static async enableVueInspector() {
    return devtoolsBridge.rpc.emit<void>(bridgeRpcEvents.enableVueInspector)
  }

  static async toggleApp(id: string) {
    return devtoolsBridge.rpc.emit<void>(bridgeRpcEvents.toggleApp, id)
  }
}
