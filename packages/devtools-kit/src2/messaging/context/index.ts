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

export function updateMessagingContext(ctx: Partial<MessagingContext>, id?: string) {
  if (id) {
    target[`__devtools_kit_messaging_context_${id}__`] = {
      ...target[`__devtools_kit_messaging_context_${id}__`],
      ...ctx,
    }
  }
  else {
    target.__devtoolsKitMessagingContext__ = {
      ...target.__devtoolsKitMessagingContext__,
      ...ctx,
    }
  }
}

export function getMessagingContext(id?: string): MessagingContext {
  return id ? target[`__devtools_kit_messaging_context_${id}__`] : target.__devtoolsKitMessagingContext__
}

export function createMessagingContext(id?: string): MessagingContext {
  if (id) {
    return target[`__devtools_kit_messaging_context_${id}__`] ??= {
      env: 'client',
      channels: {
        client: [],
        server: [],
      },
      rpc: {
        client: null!,
        server: null!,
      },
    }
  }
  else {
    return target.__devtoolsKitMessagingContext__ ??= {
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
  }
}
