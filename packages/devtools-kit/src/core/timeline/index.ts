import { devtoolsContext } from '../../state'

export interface TimelineEvent {
  event: {
    groupId: number
    time: number
    title: string
    subtitle: string
    // @TODO: InspectorCustomState type
    data: Record<string, unknown>
  }
  layerId: string
}

export function addTimelineLayer(payload: any) {
  devtoolsContext.timelineLayer.push(payload)
}

export function getTimelineLayer() {
  return devtoolsContext.timelineLayer
}
