import type { ViteDevServer } from 'vite'
import { getViteServerContext, setViteServerContext } from './shared'

export function initViteServerContext(context: ViteDevServer) {
  setViteServerContext(context)
}

export function defineViteServerAction<T = Promise<unknown>>(name: string, action: (...args: any[]) => void | T) {
  const viteServer = getViteServerContext()
  // `server.hot` (Vite 5.1+) > `server.ws`
  const ws = viteServer.hot ?? viteServer.ws
  ws.on(name, async ({ key, payload }) => {
    const res = await action(...payload)
    ws.send(key, res)
  })
}

export function callViteClientListener(name: string) {
  return async (...args: any[]) => {
    const viteServer = getViteServerContext()
    // `server.hot` (Vite 5.1+) > `server.ws`
    const ws = viteServer.hot ?? viteServer.ws

    ws.send(name, ...args)
  }
}
