import { target } from '@vue/devtools-shared'
import type { ViteHotContext } from 'vite-hot-client'
import type { ViteDevServer } from 'vite'

export const VITE_CLIENT_HOT_CONTEXT = 'vite:client-hot-context'
export const VITE_SERVER_CONTEXT = 'vite:server'

export function getViteClientHotContext(): ViteHotContext {
  return target[VITE_CLIENT_HOT_CONTEXT]
}

export function setViteClientHotContext(context: ViteHotContext) {
  target[VITE_CLIENT_HOT_CONTEXT] = context
}

export function getViteServerContext(): ViteDevServer {
  return target[VITE_SERVER_CONTEXT]
}

export function setViteServerContext(context: ViteDevServer) {
  target[VITE_SERVER_CONTEXT] = context
}
