import type { ComponentState, ComponentTreeNode } from '@vue-devtools-next/schema'
import { BridgeEvents } from '@vue-devtools-next/schema'
import { NOOP, target } from '@vue-devtools-next/shared'
import type { Emitter, EventType, Handler } from 'mitt'
import mitt from 'mitt'
import type { DispatchDevToolsRequestsOptions, DispatchDevtoolsRequestPayload } from './dispatcher'

export interface BridgeAdapterOptions {
  tracker: (fn: Function) => void
  trigger: (data: Record<string, any>) => void
}

export type BridgeInstanceType = InstanceType<typeof Bridge>

// @TODO: add unit tests
export class Bridge<Events extends Record<EventType, any>, Key extends keyof Events> {
  private emitter: Emitter<Events>
  private adapter: BridgeAdapterOptions

  constructor(adapter: BridgeAdapterOptions = {
    tracker: NOOP,
    trigger: NOOP,
  }) {
    this.emitter = mitt<Events>()
    this.adapter = adapter
    this.adapter.tracker((message) => {
      // @TODO: message handler
      this._emit(message.event, message.data)
    })
  }

  static get value() {
    return target.__VUE_DEVTOOLS_BRIDGE__
  }

  static set value(value) {
    target.__VUE_DEVTOOLS_BRIDGE__ = value
  }

  private _on(eventName: Key, handler: Handler<Events[Key]>): void {
    this.emitter.on(eventName, handler)
  }

  private off(eventName: Key, handler: Handler<Events[Key]>): void {
    this.emitter.off(eventName, handler)
  }

  private _emit(eventName: Key, data?: any): void {
    this.emitter.emit(eventName, data)
  }

  public on(eventName: Key, handler: Handler<Events[Key]>): () => void {
    this._on(eventName, handler)
    return () => this.off(eventName, handler)
  }

  public once(eventName: Key, handler: Handler<Events[Key]>): void {
    const onceHandler = (...args) => {
      // @ts-expect-error missing type
      handler(...args)
      this.off(eventName, onceHandler)
    }
    this._on(eventName, onceHandler)
  }

  public emit(eventName: Key, data?: any): void {
    this.adapter.trigger({
      event: eventName,
      data,
    })
    this._emit(eventName, data)
  }

  public removeAllListeners(): void {
    this.emitter.all.clear()
  }
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
      Bridge.value.emit(BridgeEvents.GET_DEVTOOLS_CLIENT_DATA_RESPONSE, {
        data: 'hello',
      })
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

  static getInstanceState<S extends { data: { data: { state: ComponentState[] } } }, Q extends { instanceId: string }>(params?: Q, cb?: (payload: S['data']) => void) {
    return BridgeRpc.getDataFromUserApp<S, Q>({ type: 'component-state', params }, ({ data }) => cb?.(data))
  }

  static getInspetorTree<S extends { data: { data: { id: string;label: string }[] } }, Q extends { inspectorId?: string; filter?: string }>(params?: Q, cb?: (payload: S['data']) => void) {
    return BridgeRpc.getDataFromUserApp<S, Q>({ type: 'inspector-tree', params }, ({ data }) => cb?.(data))
  }
}
