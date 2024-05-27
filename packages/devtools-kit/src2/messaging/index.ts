import { BirpcGroup, createBirpcGroup } from 'birpc'
import {
  createBroadcastChannel,
  createIframeClientChannel,
  createIframeServerChannel,
} from './presets'

import { getCurrentMessagingEnv } from './env'
import { getMessagingContext } from './context'

export * from './env'

export interface CreateMessageChannelOptions {
  preset?: string | string[]
}

async function initMessageChannel(preset: string[]) {
  const host = getCurrentMessagingEnv()
  const channels = getMessagingContext().channels[host]
  for (const p of preset) {
    if (p === 'iframe') {
      const channel = host === 'client' ? await createIframeClientChannel() : createIframeServerChannel()
      channels.push(channel)
    }
    else if (p === 'broadcast') {
      const channel = createBroadcastChannel()
      channels.push(channel)
    }
  }
}

export async function createMessageChannel(options: CreateMessageChannelOptions = {}) {
  const {
    preset = ['iframe', 'broadcast'],
  } = options
  const p = Array.isArray(preset) ? preset : [preset]
  initMessageChannel(p)
}

export function getRpc<T extends Record<string, Function | Record<string, Function>>>(): BirpcGroup<T, T> {
  const host = getCurrentMessagingEnv()
  return getMessagingContext().rpc[host] as BirpcGroup<T, T>
}

export function setRpcToGlobal<T extends BirpcGroup<unknown, unknown>>(rpc: T) {
  const host = getCurrentMessagingEnv()
  getMessagingContext().rpc[host] = rpc
}

export function createRpc<
RemoteFunctions = Record<string, Function>,
LocalFunctions extends Record<string, Function> = Record<string, Function>,
>(functions: LocalFunctions) {
  const host = getCurrentMessagingEnv()
  const channels = getMessagingContext().channels[host]
  const rpc = createBirpcGroup<RemoteFunctions, LocalFunctions>(functions, channels, {
    timeout: -1,
  })
  setRpcToGlobal<typeof rpc>(rpc)
  return rpc
}
