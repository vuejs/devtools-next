import type { DevToolsContext } from '@vue/devtools-schema'
import { devtoolsContext } from '../general/state'

export type * from './types'

export function addTimelineLayer(payload: DevToolsContext['timelineLayer'][0]) {
  devtoolsContext.timelineLayer.push(payload)
}

export function getTimelineLayer() {
  return devtoolsContext.timelineLayer
}
