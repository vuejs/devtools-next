import { NOOP } from '@vue-devtools-next/shared'
import type { Emitter, EventType, Handler } from 'mitt'
import mitt from 'mitt'
import { parse } from '@vue-devtools-next/kit'
import type { InspectorStateEditorPayload, ScrollToComponentOptions, ToggleComponentInspectorOptions } from '@vue-devtools-next/kit'

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

export const bridgeRpcEvents = {
  toggleComponentInspector: 'toggle-component-inspector',
  inspectComponentInspector: 'inspect-component-inspector',
  scrollToComponent: 'scroll-to-component',
  componentBoundingRect: 'component-bounding-rect',
  inspectorTree: 'inspector-tree',
  inspectorState: 'inspector-state',
  updateInspectorTreeId: 'inspector-tree:update-id',
  state: 'state',
  timelineLayer: 'timeline-layer',
  routerInfo: 'router-info',
  router: 'router',
  routeMatched: 'route-matched',
  editState: 'edit-inspector-state',
  openInEditor: 'open-in-editor',
  toggleApp: 'toggle-app',
} as const

export type BridgeRpcEvents = typeof bridgeRpcEvents
export type BridgeRpcEventName = BridgeRpcEvents[keyof BridgeRpcEvents]
export interface BridgeRpcEventPayload {
  [bridgeRpcEvents.toggleComponentInspector]: ToggleComponentInspectorOptions
  [bridgeRpcEvents.scrollToComponent]: ScrollToComponentOptions
  [bridgeRpcEvents.inspectComponentInspector]: string
  [bridgeRpcEvents.componentBoundingRect]: {
    inspectorId: string
    instanceId: string
  }
  [bridgeRpcEvents.inspectorTree]: {
    inspectorId?: string
    filter?: string
  }
  [bridgeRpcEvents.updateInspectorTreeId]: string
  [bridgeRpcEvents.inspectorState]: {
    inspectorId: string
    nodeId: string
  }
  [bridgeRpcEvents.state]: null
  [bridgeRpcEvents.timelineLayer]: null
  [bridgeRpcEvents.routerInfo]: null
  [bridgeRpcEvents.router]: string
  [bridgeRpcEvents.routeMatched]: string
  [bridgeRpcEvents.editState]: InspectorStateEditorPayload
  [bridgeRpcEvents.openInEditor]: string
  [bridgeRpcEvents.toggleApp]: string
}

export class BridgeRpcCore {
  bridge: BridgeInstanceType
  constructor(_bridge: BridgeInstanceType) {
    this.bridge = _bridge
  }

  on<E extends BridgeRpcEventName>(
    eventName: E,
    handler: (payload?: BridgeRpcEventPayload[E]) => Promise<string | void> | string,
  ) {
    this.bridge.on(`${eventName}:req`, async (payload?: BridgeRpcEventPayload[E]) => {
      const res = await handler(payload)
      this.bridge.emit(`${eventName}:res`, res)
    })
  }

  emit<S, E extends BridgeRpcEventName = BridgeRpcEventName>(
    eventName: E,
    payload?: BridgeRpcEventPayload[E],
  ) {
    return new Promise<S>((resolve) => {
      this.bridge.once(`${eventName}:res`, (payload: string) => {
        const res = {
          data: parse(payload),
        } as S
        resolve(res)
      })
      this.bridge.emit(`${eventName}:req`, payload)
    })
  }
}
