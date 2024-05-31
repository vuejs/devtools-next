import type { ResolvedConfig } from 'vite'

export function getConfigFunctions(config: ResolvedConfig) {
  return {
    getRoot() {
      return config.root
    },
  }
}
