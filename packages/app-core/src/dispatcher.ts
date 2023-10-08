import { devtools } from 'vue-devtools-kit'

export interface DispatchDevToolsRequestsOptions {
  type: string
  params?: Record<string, unknown>
}

export interface SyncUpdatedToDevToolsOptions {
  type: string
}

export async function dispatchDevToolsRequests(options: DispatchDevToolsRequestsOptions, cb: (data: unknown) => void) {
  const { type } = options
  if (type === 'state') {
    const state = devtools.state
    // sync updated
    devtools.api.on.devtoolsStateUpdated((payload) => {
      cb({
        connected: payload.connected,
        vueVersion: payload.activeAppRecord?.version || '',
      })
    })

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
    // sync updated
    devtools.api.on.componentTreeUpdated((payload) => {
      cb(payload)
    })
    return treeNode
  }
}
