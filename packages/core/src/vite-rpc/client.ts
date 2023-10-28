import type { ViteHotContext } from 'vite-hot-client'
import { createRPCClient } from './rpc'
import type { ViteRPCFunctions } from './types'

export function setupViteRPCClient(ctx: ViteHotContext | undefined) {
  if (!ctx)
    return null
  const rpcClient = createRPCClient<ViteRPCFunctions>('vite-plugin-vue-devtools', ctx, {})
  return rpcClient
}
