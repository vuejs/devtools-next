import { devtools } from 'vue-devtools-kit'
import { parse } from 'vue-devtools-kit/shared'

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
    devtools.context.api.on.devtoolsStateUpdated((payload) => {
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
    const treeNode = await devtools.context.api.getComponentTree({
      filterText: '',
      recursively: false,
    })
    // sync updated
    devtools.context.api.on.componentTreeUpdated((payload) => {
      cb(payload)
    })
    cb(treeNode)
  }
  else if (type === 'component-state') {
    devtools.state.selectedComponentId = params?.instanceId as string
    const componentState = devtools.context.api.getInstanceState(params as { instanceId: string })
    // sync updated
    // @TODO: remove listener side effect
    devtools.context.api.on.componentStateUpdated((id) => {
      if (id === devtools.state.selectedComponentId) {
        const componentState = devtools.context.api.getInstanceState({ instanceId: devtools.state.selectedComponentId! })
        cb({ data: componentState })
      }
    })
    cb({ data: parse(componentState) })
  }
  else if (type === 'inspector-tree') {
    const state = devtools.context.api.getInspectorTree(params)
    cb({ data: parse(state) })
  }
}
