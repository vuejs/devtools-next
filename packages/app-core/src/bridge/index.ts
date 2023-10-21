import type { ComponentTreeNode, InspectorState } from '@vue-devtools-next/schema'
import { BridgeEvents } from '@vue-devtools-next/schema'
import type { DispatchDevToolsRequestsOptions, DispatchDevtoolsRequestPayload } from '../dispatcher'

import { Bridge } from './core'
import { BridgeRpc as DevToolsRpc, initBridgeRpc as initDevToolsSideBridgeRpc } from './devtools'
import { BridgeRpc as UserAppRpc, initBridgeRpc as initUserAppSideBridgeRpc } from './user-app'

export type { BridgeAdapterOptions, BridgeInstanceType } from './core'
export {
  Bridge,
  DevToolsRpc,
  UserAppRpc,
}

export class BridgeRpc {
  static getDataFromUserApp<S, Q = unknown>(options: { type: string; params?: Q }, cb?: (payload: S) => void) {
    // @TODO: reject fallback logic
    return new Promise<S>((resolve, reject) => {
      Bridge.value.emit(BridgeEvents.GET_USER_APP_DATA_REQUEST, options)
      if (cb) {
        Bridge.value.on(BridgeEvents.GET_USER_APP_DATA_RESPONSE, (payload: S & { type: string }) => {
          payload.type === options.type && cb(payload)
        })
      }
      else {
        Bridge.value.once(BridgeEvents.GET_USER_APP_DATA_RESPONSE, (payload: S & { type: string }) => {
          payload.type === options.type && resolve(payload)
        })
      }
    })
  }

  static onDataFromDevTools(
    options: {
      dispatcher: (options: DispatchDevToolsRequestsOptions, cb: (data: unknown) => void) => Promise<unknown>
    },
  ) {
    const { dispatcher } = options

    Bridge.value.on(BridgeEvents.GET_USER_APP_DATA_REQUEST, (options: DispatchDevToolsRequestsOptions) => {
      const { type } = options
      const cb = (res: unknown) => {
        res && Bridge.value.emit(BridgeEvents.GET_USER_APP_DATA_RESPONSE, {
          data: res,
          type,
        })
      }
      dispatcher(options, cb)
    })
  }

  static getDataFromDevTools<T>() {
    // @TODO: reject fallback logic
    return new Promise<T>((resolve, reject) => {
      Bridge.value.emit(BridgeEvents.GET_DEVTOOLS_CLIENT_DATA_REQUEST)
      Bridge.value.once(BridgeEvents.GET_DEVTOOLS_CLIENT_DATA_RESPONSE, (payload) => {
        resolve(payload)
      })
    })
  }

  static onDataFromUserApp() {
    Bridge.value.on(BridgeEvents.GET_DEVTOOLS_CLIENT_DATA_REQUEST, () => {
      Bridge.value.emit(BridgeEvents.GET_DEVTOOLS_CLIENT_DATA_RESPONSE)
    })
  }
}

export class BridgeApi {
  static getDevToolsState<S extends { data: { connected: boolean;vueVersion: string } }>(cb: (payload: S['data']) => void) {
    return BridgeRpc.getDataFromUserApp<S>({ type: 'state' }, ({ data }) => cb(data))
  }

  static getComponentTree<S extends { data: ComponentTreeNode[] }, Q = DispatchDevtoolsRequestPayload['component-tree']>(
    params?: Q,
    cb?: (payload: S['data']) => void,
  ) {
    return BridgeRpc.getDataFromUserApp<S, Q>({ type: 'component-tree', params }, ({ data }) => cb?.(data))
  }

  static getInstanceState<S extends { data: { data: { state: InspectorState[] } } }, Q extends { instanceId: string }>(params?: Q, cb?: (payload: S['data']) => void) {
    return BridgeRpc.getDataFromUserApp<S, Q>({ type: 'component-state', params }, ({ data }) => cb?.(data))
  }

  static getInspectorTree<S extends { data: { data: { id: string;label: string }[] } }, Q extends { inspectorId?: string; filter?: string }>(params?: Q, cb?: (payload: S['data']) => void) {
    return BridgeRpc.getDataFromUserApp<S, Q>({ type: 'inspector-tree', params }, ({ data }) => cb?.(data))
  }

  static getInspectorState<S extends { data: { data: { state: Record<string, InspectorState[]> } } }, Q extends { inspectorId?: string; filter?: string }>(params?: Q, cb?: (payload: S['data']) => void) {
    return BridgeRpc.getDataFromUserApp<S, Q>({ type: 'inspector-state', params }, ({ data }) => cb?.(data))
  }
}

export function registerBridgeRpc(target: 'devtools' | 'user-app') {
  if (target === 'devtools')
    initDevToolsSideBridgeRpc()

  else
    initUserAppSideBridgeRpc()
}

type BridgeRpcType<T extends 'devtools' | 'user-app'> = {
  'devtools': DevToolsRpc
  'user-app': UserAppRpc
}[T]
export function getBridgeRpc<T extends 'devtools' | 'user-app'>(target: T): BridgeRpcType<T> {
  if (target === 'devtools')
    return DevToolsRpc

  else
    return UserAppRpc
}
