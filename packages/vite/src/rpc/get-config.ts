import { RpcFunctionCtx } from './types'

export function getConfigFunctions(ctx: RpcFunctionCtx) {
  return {
    getRoot() {
      return ctx.config.root
    },
  }
}
