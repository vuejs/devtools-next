import { target } from '@vue/devtools-shared'
import { MergeableChannelOptions } from '../types'

export interface MessagingContext {
  env: 'client' | 'server'
  channels: Record<'client' | 'server', MergeableChannelOptions[]>
}

target.__devtoolsKitMessagingContext__ = {
  env: 'client',
  channels: {
    client: [],
    server: [],
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
