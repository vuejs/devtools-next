import { createMessagingRpc, getRpc } from '@vue/devtools-kit'
import { createHooks } from 'hookable'

const hooks = createHooks()
const MESSAGING_ID = 'vite-rpc'

export const viteRpcFunctions = {
  heartbeat: () => ({}),
  hi(name: string) {
    return name
  },
}

export type ViteRPCFunctions = typeof viteRpcFunctions

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

export function createViteServerMessagingRpc() {
  createMessagingRpc({
    functions: viteRpcFunctions,
    env: 'server',
    id: MESSAGING_ID,
    preset: ['vite'],
  })
}
