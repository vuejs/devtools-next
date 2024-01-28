import type { ViteHotContext } from 'vite-hot-client'
import { createRPCClient } from 'vite-dev-rpc'
import type { BirpcReturn } from 'birpc'
import type { ViteRPCFunctions } from './types'

export interface SetupViteRPCClientOptions {
  moduleUpdated?: () => void
}
export function setupViteRPCClient(ctx: ViteHotContext | undefined, options: SetupViteRPCClientOptions = {}): BirpcReturn<ViteRPCFunctions, unknown> {
  if (!ctx)
    return null!

  const { moduleUpdated = () => {} } = options
  const rpcClient = createRPCClient<ViteRPCFunctions>('vite-plugin-vue-devtools', ctx, {
    moduleUpdated,
  }, {
    timeout: -1,
  })
  return rpcClient
}
