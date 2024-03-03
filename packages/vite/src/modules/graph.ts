import type { ViteInspectAPI } from 'vite-plugin-inspect'
import { debounce } from 'perfect-debounce'
import type { ViteDevServer } from 'vite'
import { callViteClientListener, defineViteServerAction } from '@vue/devtools-core'

export function setupGraphModule(options: { rpc: ViteInspectAPI['rpc'], server: ViteDevServer }) {
  const { rpc, server } = options

  defineViteServerAction('graph:get-modules', async () => {
    const list = await rpc.list()
    const modules = list?.modules || []

    return modules
  })

  const triggerModuleUpdated = callViteClientListener('graph:module-updated')

  const debouncedModuleUpdated = debounce(() => {
    triggerModuleUpdated()
  }, 100)

  server.middlewares.use((_, __, next) => {
    debouncedModuleUpdated()
    next()
  })
}
