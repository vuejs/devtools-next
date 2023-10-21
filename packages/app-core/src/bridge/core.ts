import { NOOP, target } from '@vue-devtools-next/shared'
import type { Emitter, EventType, Handler } from 'mitt'
import mitt from 'mitt'
import { parse } from 'vue-devtools-kit/shared'

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

export const bridgeRpcEvents = {
  inspectorTree: 'inspector-tree',
  inspectorState: 'inspector-state',
  state: 'state',
} as const

export type BridgeRpcEvents = typeof bridgeRpcEvents
export type BridgeRpcEventName = BridgeRpcEvents[keyof BridgeRpcEvents]
export interface BridgeRpcEventPayload {
  [bridgeRpcEvents.inspectorTree]: {
    inspectorId?: string
    filter?: string
  }
  [bridgeRpcEvents.inspectorState]: {
    inspectorId: string
    nodeId: string
  }
  [bridgeRpcEvents.state]: null
}

export const bridgeRpcCore = {
  on<E extends BridgeRpcEventName>(
    eventName: E,
    handler: (payload?: BridgeRpcEventPayload[E]) => Promise<string> | string,
  ) {
    Bridge.value.on(`${eventName}:req`, async (payload?: BridgeRpcEventPayload[E]) => {
      const res = await handler(payload)
      Bridge.value.emit(`${eventName}:res`, res)
    })
  },
  emit<S, E extends BridgeRpcEventName = BridgeRpcEventName>(
    eventName: E,
    payload?: BridgeRpcEventPayload[E],
  ) {
    Bridge.value.emit(`${eventName}:req`, payload)
    return new Promise<S>((resolve) => {
      Bridge.value.once(`${eventName}:res`, (payload: string) => {
        const res = {
          data: parse(payload),
        } as S
        resolve(res)
      })
    })
  },
}
