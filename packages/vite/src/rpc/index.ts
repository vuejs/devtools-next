import type { ResolvedConfig, ViteDevServer } from 'vite'
import type { ViteInspectAPI } from 'vite-plugin-inspect'

import { getAssetsFunctions } from './assets'
import { getConfigFunctions } from './get-config'
import { getGraphFunctions } from './graph'

export function getRpcFunctions(options: { rpc: ViteInspectAPI['rpc'], server: ViteDevServer, config: ResolvedConfig }) {
  return {
    ...getAssetsFunctions(options),
    ...getConfigFunctions(options.config),
    ...getGraphFunctions(
      {
        rpc: options.rpc,
        server: options.server,
      },
    ),
  }
}
