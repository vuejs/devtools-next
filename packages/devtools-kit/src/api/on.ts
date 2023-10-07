import { VueAppInstance } from '@vue-devtools-next/schema'
import type { App } from 'vue'

export enum DevToolsEvents {
  APP_INIT = 'app:init',
  COMPONENT_ADDED = 'component:added',
  COMPONENT_UPDATED = 'component:updated',
  COMPONENT_REMOVED = 'component:removed',
}

type HookAppInstance = App & VueAppInstance
interface DevToolsEvent {
  [DevToolsEvents.APP_INIT]: (app: VueAppInstance['appContext']['app'], version: string) => void
  [DevToolsEvents.COMPONENT_ADDED]: (app: HookAppInstance, uid: number, parentUid: number, component: VueAppInstance) => void
  [DevToolsEvents.COMPONENT_UPDATED]: DevToolsEvent['component:added']
  [DevToolsEvents.COMPONENT_REMOVED]: DevToolsEvent['component:added']
}

const devtoolsEventsBuffer: {
  [P in DevToolsEvents]: Array<DevToolsEvent[P]>
} = {
  [DevToolsEvents.APP_INIT]: [],
  [DevToolsEvents.COMPONENT_ADDED]: [],
  [DevToolsEvents.COMPONENT_UPDATED]: [],
  [DevToolsEvents.COMPONENT_REMOVED]: [],
}

export function callBuffer<T extends keyof DevToolsEvent>(eventName: T, ...args: Parameters<DevToolsEvent[T]>) {
  // @ts-expect-error tuple rest
  devtoolsEventsBuffer[eventName].forEach(fn => fn(...args))
}

export const on = {
  vueAppInit(fn: DevToolsEvent[DevToolsEvents.APP_INIT]) {
    devtoolsEventsBuffer[DevToolsEvents.APP_INIT].push(fn)
  },
  componentAdded(fn: DevToolsEvent[DevToolsEvents.COMPONENT_ADDED]) {
    devtoolsEventsBuffer[DevToolsEvents.COMPONENT_ADDED].push(fn)
  },
  componentUpdated(fn: DevToolsEvent[DevToolsEvents.COMPONENT_UPDATED]) {
    devtoolsEventsBuffer[DevToolsEvents.COMPONENT_UPDATED].push(fn)
  },
  componentRemoved(fn: DevToolsEvent[DevToolsEvents.COMPONENT_REMOVED]) {
    devtoolsEventsBuffer[DevToolsEvents.COMPONENT_REMOVED].push(fn)
  },
}
