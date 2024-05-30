import { BirpcGroup, createBirpcGroup } from 'birpc'
import {
  createBroadcastChannel,
  createIframeClientChannel,
  createIframeServerChannel,
  createViteClientChannel,
  createViteServerChannel,
} from './presets'

import { getCurrentMessagingEnv, setCurrentMessagingEnv } from './env'
import { createMessagingContext, getMessagingContext } from './context'

export { createMessagingContext } from './context'

export { setViteServerContext, setViteClientContext } from './presets'

export * from './env'

export interface CreateMessageChannelOptions {
  preset?: string | string[]
}

export async function initMessageChannel(preset: string[], id?: string) {
  const host = getCurrentMessagingEnv(id)
  const channels = getMessagingContext(id).channels[host]
  for (const p of preset) {
    if (p === 'iframe') {
      const channel = host === 'client' ? await createIframeClientChannel() : createIframeServerChannel()
      channels.push(channel)
    }
    else if (p === 'broadcast') {
      const channel = createBroadcastChannel()
      channels.push(channel)
    }
    else if (p === 'vite') {
      const channel = host === 'client' ? createViteClientChannel() : createViteServerChannel()
      channels.push(channel)
    }
  }
}

export async function createMessageChannel(preset: string | string[], id?: string) {
  const p = Array.isArray(preset) ? preset : [preset]
  initMessageChannel(p, id)
}

export function getRpc<T extends Record<string, Function | Record<string, Function>>>(id?: string): BirpcGroup<T, T> {
  const host = getCurrentMessagingEnv(id)
  if (!host)
    return null!
  return getMessagingContext(id).rpc[host] as BirpcGroup<T, T>
}

export function setRpcToGlobal<T extends BirpcGroup<unknown, unknown>>(rpc: T, id?: string) {
  const host = getCurrentMessagingEnv(id)
  getMessagingContext(id).rpc[host] = rpc
}

export function createRpc<
RemoteFunctions = Record<string, Function>,
LocalFunctions extends Record<string, Function> = Record<string, Function>,
>(functions: LocalFunctions, id?: string) {
  const host = getCurrentMessagingEnv(id)
  const channels = getMessagingContext(id).channels[host]
  const rpc = createBirpcGroup<RemoteFunctions, LocalFunctions>(functions, channels, {
    timeout: -1,
  })
  setRpcToGlobal<typeof rpc>(rpc, id)
  return rpc
}

export interface CreateMessagingRpcOptions<T> {
  functions: T
  id?: string
  env: 'client' | 'server'
  preset?: string | string[]
}

export function createMessagingRpc<
RemoteFunctions = Record<string, Function>,
LocalFunctions extends Record<string, Function> = Record<string, Function>,
>(options: CreateMessagingRpcOptions<LocalFunctions>) {
  const { functions, id, env, preset = ['broadcast'] } = options
  createMessagingContext(id)
  setCurrentMessagingEnv(env, id)
  createMessageChannel(preset, id)
  return createRpc<RemoteFunctions, LocalFunctions>(functions, id)
}
