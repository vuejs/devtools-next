import type { ComponentBoundingRect } from '../component/types'

export interface ComponentHighLighterOptions {
  bounds: ComponentBoundingRect
  name?: string
  id?: string
  visible?: boolean
}

export interface ScrollToComponentOptions {
  id?: string
}
