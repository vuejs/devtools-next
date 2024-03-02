import { NOOP } from '@vue/devtools-shared'
import type { Emitter, EventType, Handler } from 'mitt'
import mitt from 'mitt'

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
