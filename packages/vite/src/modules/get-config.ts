import { defineViteServerAction } from '@vue/devtools-core'
import type { ResolvedConfig } from 'vite'

export function getViteConfig(config: ResolvedConfig) {
  defineViteServerAction('get-vite-root', () => {
    return config.root
  })
}
