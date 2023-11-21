import type { WebSocketServer } from 'vite'
import type { BirpcGroupReturn } from 'birpc'
import { createRPCServer } from 'vite-dev-rpc'
import type { ViteRPCFunctions } from './types'

export async function setupViteRPCServer(ws: WebSocketServer, functions: ViteRPCFunctions): Promise<BirpcGroupReturn<ViteRPCFunctions>> {
  const rpcServer = createRPCServer<ViteRPCFunctions>('vite-plugin-vue-devtools', ws, functions)
  return rpcServer
}
