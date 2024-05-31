import { createMessagingRpc, getRpc } from '@vue/devtools-kit'
import { createHooks } from 'hookable'
import type { AssetImporter, AssetInfo, ImageMeta, ModuleInfo } from './types'

const hooks = createHooks()
const MESSAGING_ID = 'vite-rpc'

export const viteRpcFunctions = {
  on: (event: string, handler: Function) => {
    hooks.hook(event, handler)
  },
  off: (event: string, handler: Function) => {
    hooks.removeHook(event, handler)
  },
  once: (event: string, handler: Function) => {
    hooks.hookOnce(event, handler)
  },
  emit: (event: string, ...args: any[]) => {
    hooks.callHook(event, ...args)
  },
  heartbeat: () => ({}),
  hi(name: string) {
    return name
  },
}

export type ViteRPCFunctions = typeof viteRpcFunctions & {
  // assets
  getStaticAssets: () => Promise<AssetInfo[]>
  getAssetImporters: (url: string) => Promise<AssetImporter[]>
  getImageMeta: (filepath: string) => Promise<ImageMeta>
  getTextAssetContent: (filepath: string, limit?: number) => Promise<string>
  // config
  getRoot: () => Promise<string>
  // graph
  getGraphModules: () => Promise<ModuleInfo[]>
}

export const viteRpc = new Proxy<{
  value: ReturnType<typeof getRpc<ViteRPCFunctions>>['broadcast']
  functions: ReturnType<typeof getRpc<ViteRPCFunctions>>['functions']
}>({
  value: {} as ReturnType<typeof getRpc<ViteRPCFunctions>>['broadcast'],
  functions: {} as ReturnType<typeof getRpc<ViteRPCFunctions>>['functions'],
}, {
  get(target, property) {
    const _rpc = getRpc<ViteRPCFunctions>(MESSAGING_ID)
    if (property === 'value')
      return _rpc?.broadcast
    else if (property === 'functions')
      return _rpc?.functions
  },
})

export function onViteRpcConnected(callback: () => void) {
  let timer: number = null!

  function heartbeat() {
    viteRpc.value?.heartbeat?.().then(() => {
      clearTimeout(timer)
      callback()
    }).catch(() => ({}))
    timer = setTimeout(() => {
      heartbeat()
    }, 80) as unknown as number
  }

  heartbeat()
}

export function createViteClientMessagingRpc() {
  createMessagingRpc({
    functions: viteRpcFunctions,
    env: 'client',
    id: MESSAGING_ID,
    preset: ['vite'],
  })
}

export function createViteServerMessagingRpc(functions: Record<string, any>) {
  createMessagingRpc({
    functions: {
      ...viteRpcFunctions,
      ...functions,
    },
    env: 'server',
    id: MESSAGING_ID,
    preset: ['vite'],
  })
}
