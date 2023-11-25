import type { Placement } from 'floating-vue'

export interface FloatingVueCommonProps {
  trigger?: 'click' | 'hover'
  distance?: number
  skidding?: number
  placement?: Placement
  disabled?: boolean
  shown?: boolean
}
