import { target } from '@vue/devtools-shared'
import { BirpcGroup } from 'birpc'
import { MergeableChannelOptions } from '../types'

export interface MessagingContext {
  env: 'client' | 'server'
  channels: Record<'client' | 'server', MergeableChannelOptions[]>
  rpc: Record<'client' | 'server', BirpcGroup<unknown, unknown>>
}

target.__devtoolsKitMessagingContext__ ??= {
  env: 'client',
  channels: {
    client: [],
    server: [],
  },
  rpc: {
    client: null,
    server: null,
  },
}

export function updateMessagingContext(ctx: Partial<MessagingContext>) {
  target.__devtoolsKitMessagingContext__ = {
    ...target.__devtoolsKitMessagingContext__,
    ...ctx,
  }
}

export function getMessagingContext(): MessagingContext {
  return target.__devtoolsKitMessagingContext__
}
