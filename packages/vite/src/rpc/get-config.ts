import { RpcFunctionCtx } from '.'

export function getConfigFunctions(ctx: RpcFunctionCtx) {
  return {
    getRoot() {
      return ctx.config.root
    },
  }
}
