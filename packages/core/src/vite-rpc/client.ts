import type { ViteHotContext } from 'vite-hot-client'
import { createRPCClient } from 'vite-dev-rpc'
import type { BirpcReturn } from 'birpc'
import type { ViteRPCFunctions } from './types'

export function setupViteRPCClient(ctx: ViteHotContext | undefined): BirpcReturn<ViteRPCFunctions> {
  if (!ctx)
    return null!
  const rpcClient = createRPCClient<ViteRPCFunctions>('vite-plugin-vue-devtools', ctx, {})
  return rpcClient
}
