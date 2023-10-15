import { devtools } from 'vue-devtools-kit'

export interface DispatchDevToolsRequestsOptions {
  type: string
  params?: Record<string, unknown>
}

export interface SyncUpdatedToDevToolsOptions {
  type: string
}

export async function dispatchDevToolsRequests(options: DispatchDevToolsRequestsOptions, cb: (data: unknown) => void) {
  const { type, params } = options
  if (type === 'state') {
    const state = devtools.state
    // sync updated
    devtools.api.on.devtoolsStateUpdated((payload) => {
      cb({
        connected: payload.connected,
        vueVersion: payload.activeAppRecord?.version || '',
      })
    })

    cb({
      connected: state.connected,
      vueVersion: state.activeAppRecord?.version || '',
    })
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
    cb(treeNode)
  }
  else if (type === 'component-state') {
    devtools.state.selectedComponentId = params?.instanceId as string
    const componentState = devtools.api.getInstanceState(params as { instanceId: string })
    // sync updated
    // @TODO: remove listener side effect
    devtools.api.on.componentStateUpdated((id) => {
      if (id === devtools.state.selectedComponentId) {
        const componentState = devtools.api.getInstanceState({ instanceId: devtools.state.selectedComponentId! })
        cb({ data: componentState })
      }
    })
    cb({ data: componentState })
  }
}
