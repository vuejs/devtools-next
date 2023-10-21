import { devtools } from 'vue-devtools-kit'
import { parse } from 'vue-devtools-kit/shared'

export type DispatchDevtoolsRequestType = 'state' | 'component-tree' | 'component-state' | 'inspector-tree' | 'inspector-state'

export interface DispatchDevtoolsRequestPayload {
  state: Record<PropertyKey, never>
  'component-tree': {
    filterText?: string
  }
  'component-state': {
    instanceId: string
  }
  'inspector-tree': {
    inspectorId?: string
    filter?: string
  }
  'inspector-state': {
    inspectorId: string
    nodeId: string
  }
}

export interface DispatchDevToolsRequestsOptions<T extends DispatchDevtoolsRequestType = DispatchDevtoolsRequestType> {
  type: T
  params: DispatchDevtoolsRequestPayload[T]
}

export interface SyncUpdatedToDevToolsOptions<T extends DispatchDevtoolsRequestType> {
  type: T
  data: Record<string, unknown>
}

export function assertType<T extends DispatchDevtoolsRequestType>(
  type: DispatchDevtoolsRequestType,
  assertType: T,
  _params: unknown,
): _params is DispatchDevtoolsRequestPayload[T] {
  return type === assertType
}

export async function dispatchDevToolsRequests<T extends DispatchDevtoolsRequestType>(options: DispatchDevToolsRequestsOptions<T>, cb: (data: unknown) => void) {
  const { type, params } = options
  if (assertType(type, 'state', params)) {
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
  else if (assertType(type, 'component-tree', params)) {
    const treeNode = await devtools.context.api.getComponentTree({
      filterText: params.filterText ?? '',
      recursively: false,
    })
    // sync updated
    devtools.context.api.on.componentTreeUpdated((payload) => {
      cb(payload)
    })
    cb(treeNode)
  }
  else if (assertType(type, 'component-state', params)) {
    devtools.state.selectedComponentId = params?.instanceId as string
    const componentState = devtools.context.api.getInstanceState(params as { instanceId: string })
    // sync updated
    // @TODO: remove listener side effect
    devtools.context.api.on.componentStateUpdated((id) => {
      if (id === devtools.state.selectedComponentId) {
        const componentState = devtools.context.api.getInstanceState({ instanceId: devtools.state.selectedComponentId! })
        cb({ data: parse(componentState) })
      }
    })
    cb({ data: parse(componentState) })
  }
  else if (type === 'inspector-tree') {
    const state = await devtools.context.api.getInspectorTree(params)
    cb({ data: parse(state) })
  }
  else if (type === 'inspector-state') {
    const state = devtools.context.api.getInspectorState(params)
    cb({ data: parse(state) })
  }
}
