import type { ViteInspectAPI } from 'vite-plugin-inspect'
import { debounce } from 'perfect-debounce'
import type { ViteDevServer } from 'vite'
import { viteRpc } from '@vue/devtools-core'
import type { ModuleInfo } from '@vue/devtools-core'

export function getGraphFunctions(options: { rpc: ViteInspectAPI['rpc'], server: ViteDevServer }) {
  const { rpc, server } = options
  const debouncedModuleUpdated = debounce(() => {
    viteRpc.value.emit('graphModuleUpdated')
  }, 100)

  server.middlewares.use((_, __, next) => {
    debouncedModuleUpdated()
    next()
  })
  return {
    async getGraphModules(): Promise<ModuleInfo[]> {
      const list = await rpc.list()
      const modules = list?.modules || []

      return modules
    },
  }
}
