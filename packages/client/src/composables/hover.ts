import { useEventListener } from '@vueuse/core'
import type { MaybeRef } from '@vueuse/core'

export interface UseHoverOptions {
  enter?: () => void
  leave?: () => void
  initital?: boolean
}

export function useHover(el: MaybeRef<EventTarget | null | undefined>, options: UseHoverOptions = {}) {
  const {
    enter = () => { },
    leave = () => { },
    initital = false,
  } = options
  const isHovering = ref(initital)

  useEventListener(el, 'mouseenter', () => {
    isHovering.value = true
    enter()
  })
  useEventListener(el, 'mouseleave', () => {
    isHovering.value = false
    leave()
  })
  return {
    isHovering,
  }
}
