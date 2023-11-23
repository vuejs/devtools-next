let showNotification: typeof showVueNotification

export type VueNotificationPosition =
  | 'top-left' | 'top-center' | 'top-right'
  | 'bottom-left' | 'bottom-center' | 'bottom-right'

export interface VueNotificationOptions {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  classes?: string
  duration?: number
  position?: VueNotificationPosition
}

export function showVueNotification(data: VueNotificationOptions) {
  showNotification?.(data)
}

export function provideNotificationFn(fn: typeof showVueNotification) {
  showNotification = fn
}
