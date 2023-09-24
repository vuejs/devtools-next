import type { Emitter, EventType, Handler } from 'mitt'
import mitt from 'mitt'
import { NOOP, target } from '@vue-devtools-next/shared'
import { BridgeEvents } from '@vue-devtools-next/schema'

export interface BridgeAdapterOptions {
  tracker: (fn: Function) => void
  trigger: (data: Record<string, any>) => void
}

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
}

export class BridgeRpc {
  static getDataFromUserApp<T>(options: { type: string }) {
    // @TODO: reject fallback logic
    return new Promise<T>((resolve, reject) => {
      Bridge.value.emit(BridgeEvents.GET_USER_APP_DATA_REQUEST, options)
      Bridge.value.once(BridgeEvents.GET_USER_APP_DATA_RESPONSE, (payload) => {
        resolve(payload)
      })
    })
  }

  static onDataFromDevTools() {
    Bridge.value.on(BridgeEvents.GET_USER_APP_DATA_REQUEST, (options: { type: string }) => {
      const { type } = options
      function normalizePayload(type: string) {
        if (type === 'context')
          return target.__VUE_DEVTOOLS_CTX__
      }

      Bridge.value.emit(BridgeEvents.GET_USER_APP_DATA_RESPONSE, {
        data: normalizePayload(type),
      })
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
