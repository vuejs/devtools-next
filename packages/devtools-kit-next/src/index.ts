import { initDevTools } from './core/index'
import { hook } from './hook'

export const devtools = {
  hook,
  init: initDevTools,
  get api() {
    return {}
  },
} as const
