import type { WebSocketServer } from 'vite'
import { createRPCServer } from './rpc'
import type { ViteRPCFunctions } from './types'

export async function setupViteRPCServer(ws: WebSocketServer, functions: ViteRPCFunctions) {
  const rpcServer = createRPCServer<ViteRPCFunctions>('vite-plugin-vue-devtools', ws, functions)
  return rpcServer
}
