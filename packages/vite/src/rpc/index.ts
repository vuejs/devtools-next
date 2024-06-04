import { getAssetsFunctions } from './assets'
import { getConfigFunctions } from './get-config'
import { getGraphFunctions } from './graph'
import { RpcFunctionCtx } from './types'

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
