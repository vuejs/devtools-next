import { target } from '@vue-devtools-next/shared'
import { devtools } from 'vue-devtools-kit'

export interface DispatchDevToolsRequestsOptions {
  type: string
  params?: Record<string, unknown>
}

export interface SyncUpdatedToDevToolsOptions {
  type: string
}

export async function dispatchDevToolsRequests(options: DispatchDevToolsRequestsOptions) {
  const { type } = options
  if (type === 'state') {
    const state = devtools.state
    return {
      connected: state.connected,
      vueVersion: state.activeAppRecord?.version || '',
    }
  }
  else if (type === 'component-tree') {
    const treeNode = await devtools.api.getComponentTree({
      filterText: '',
      recursively: false,
    })
    return treeNode
  }
}

export async function syncUpdatedToDevTools(cb: (data: unknown) => void) {
  devtools.api.on.devtoolsStateUpdated((payload) => {
    cb({
      connected: payload.connected,
      vueVersion: payload.activeAppRecord?.version || '',
    })
  })

  const proxy = {
    componentTree: target.__VUE_DEVTOOLS_COMPONENT_TREE_,
  }

  Object.defineProperty(target, '__VUE_DEVTOOLS_COMPONENT_TREE_', {
    set(value) {
      proxy.componentTree = value
      cb?.(value)
    },
    get() {
      return proxy.componentTree
    },
    configurable: true,
  })
}
