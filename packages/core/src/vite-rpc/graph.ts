import type { ViteInspectAPI } from 'vite-plugin-inspect'
import { debounce } from 'perfect-debounce'
import type { BirpcGroupReturn } from 'birpc'
import type { ModuleInfo, ViteRPCFunctions } from './types'

export interface SetupGraphOptions {
  rpc: ViteInspectAPI['rpc']
  server: any
  getRpcServer: () => BirpcGroupReturn<ViteRPCFunctions>
}
export function setupGraphRPC(options: SetupGraphOptions) {
  const { rpc, server, getRpcServer } = options

  const debouncedModuleUpdated = debounce(() => {
    getRpcServer().moduleUpdated()
  }, 100)

  server.middlewares.use((req, res, next) => {
    debouncedModuleUpdated()
    next()
  })

  return {
    async getGraph(): Promise<ModuleInfo[]> {
      const list = await rpc.list()
      const modules = list?.modules || []

      return modules
    },
    moduleUpdated: () => {},
  }
}
