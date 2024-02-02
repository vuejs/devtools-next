import type { VueAppInstance } from '../../../types'

export interface ComponentBoundingRect {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

export interface ComponentBoundingRectApiPayload {
  app?: VueAppInstance
  inspectorId?: string
  instanceId?: string
  rect?: ComponentBoundingRect
}
