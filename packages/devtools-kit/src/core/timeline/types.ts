import type { InspectorCustomState } from '../component/types'

export interface TimelineEventData {
  data: Record<string, InspectorCustomState>
}

export interface TimelineEvent {
  event: {
    groupId: number
    time: number
    title: string
    subtitle: string
    data: TimelineEventData
  }
  layerId: string
}
