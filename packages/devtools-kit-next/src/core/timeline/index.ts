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

export interface TimelineLayerItem {
  id: string
  label: string
  color: number
}

export function addTimelineLayer(payload: TimelineLayerItem) {
  devtoolsContext.timelineLayer.push(payload)
}

export function getTimelineLayer() {
  return devtoolsContext.timelineLayer
}
