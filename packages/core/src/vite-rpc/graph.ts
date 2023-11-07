import type { ViteInspectAPI } from 'vite-plugin-inspect'
import type { ModuleInfo } from './types'

export interface SetupGraphOptions {
  rpc: ViteInspectAPI['rpc']
}
export function setupGraphRPC(options: SetupGraphOptions) {
  const { rpc } = options
  return {
    async getGraph(): Promise<ModuleInfo[]> {
      const list = await rpc.list()
      const modules = list?.modules || []

      return modules
    },
  }
}
