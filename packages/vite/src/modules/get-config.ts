import { defineViteServerAction } from '@vue/devtools-core'
import type { ResolvedConfig } from 'vite'

export function getViteConfig(config: ResolvedConfig, pluginOptions) {
  defineViteServerAction('get-vite-root', () => {
    return config.root
  })
  defineViteServerAction('get-open-in-editor-host', () => {
    return pluginOptions.openInEditorHost
  })
}
