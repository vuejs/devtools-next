import { target } from '@vue-devtools-next/shared'
import { devtools } from 'vue-devtools-kit'
import { getComponentTree } from './hook'

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
    const hook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__
    // @TODO
    const currentAppRecord = hook.appRecords?.[0]
    if (currentAppRecord) {
      const treeNode = await getComponentTree({
        appRecord: currentAppRecord,
        filterText: '',
        recursively: false,
      })
      target.__VUE_DEVTOOLS_COMPONENT_TREE_ = treeNode!
      // return treeNode
    }
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
