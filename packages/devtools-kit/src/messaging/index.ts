import { type ChannelOptions, createBirpcGroup } from 'birpc'
import {
  createIframeClientChannel,
  createIframeServerChannel,
} from './presets'

export interface CreateMessageChannelOptions {
  on?: () => void
  post?: () => void
  preset?: string
}

const CHANNELS = globalThis.__CHANNELS__ = globalThis.__CHANNELS__ || {}

export async function createMessageChannel(options: CreateMessageChannelOptions = {}, host: 'client' | 'server') {
  const {
    on = () => {},
    post = () => {},
    preset = 'iframe',
  } = options
  if (preset === 'iframe') {
    const channel = host === 'client' ? await createIframeClientChannel() : createIframeServerChannel()
    ;(CHANNELS[host] || (CHANNELS[host] = [])).push(channel)
  }
}

export function createRpc<
RemoteFunctions = Record<string, Function>,
LocalFunctions extends Record<string, Function> = Record<string, Function>,
>(functions: LocalFunctions, host: 'client' | 'server') {
  const rpc = createBirpcGroup<RemoteFunctions, LocalFunctions>(functions, CHANNELS[host] as ChannelOptions[])
  return rpc
}
