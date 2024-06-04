import { ResolvedConfig, ViteDevServer } from 'vite'
import { ViteInspectAPI } from 'vite-plugin-inspect/index'

export interface RpcFunctionCtx {
  rpc: ViteInspectAPI['rpc']
  server: ViteDevServer
  config: ResolvedConfig
}
