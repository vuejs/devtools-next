import { useEventListener } from '@vueuse/core'

export function useWindowEventListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  useEventListener(window, type as keyof WindowEventHandlersEventMap, listener as EventListener, options)
}
