import type { ResolvedConfig, ViteDevServer } from 'vite'
import type { ViteInspectAPI } from 'vite-plugin-inspect'

import { getAssetsFunctions } from './assets'
import { getConfigFunctions } from './get-config'
import { getGraphFunctions } from './graph'

export interface RpcFunctionCtx {
  rpc: ViteInspectAPI['rpc']
  server: ViteDevServer
  config: ResolvedConfig
}

export function getRpcFunctions(ctx: RpcFunctionCtx) {
  return {
    heartbeat() {
      return true
    },
    ...getAssetsFunctions(ctx),
    ...getConfigFunctions(ctx),
    ...getGraphFunctions(ctx),
  }
}
