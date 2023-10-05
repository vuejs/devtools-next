import { target } from '@vue-devtools-next/shared'

export interface DispatchDevToolsRequestsOptions {
  type: string
  params?: Record<string, unknown>
}

export interface SyncUpdatedToDevToolsOptions {
  type: string
}

export async function dispatchDevToolsRequests(options: DispatchDevToolsRequestsOptions) {
  const { type } = options
  if (type === 'context')
    return target.__VUE_DEVTOOLS_CTX__
}

export async function syncUpdatedToDevTools(cb: (data: unknown) => void) {
  const proxy = {
    context: target.__VUE_DEVTOOLS_CTX__,
  }
  // @TODO: use proxy api to handle it?
  Object.defineProperty(target, '__VUE_DEVTOOLS_CTX__', {
    set(value) {
      proxy.context = value
      console.log(proxy.context, value)
      cb?.(value)
    },
    get() {
      return proxy.context
    },
    configurable: true,
  })
}
