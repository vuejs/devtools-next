import { devtoolsContext } from '../../state'

export interface Inspector {
  id: string
  nodeId: string
  filter: string
  treeFilterPlaceholder: string
}

export interface InspectorApiPayload {
  id: string
  label: string
  icon?: string
  treeFilterPlaceholder?: string
  actions?: {
    icon: string
    tooltip: string
    action: (payload: unknown) => void
  }[]
}

export function addInspector(payload: Inspector) {
  devtoolsContext.inspector.push(payload)
}

export function getInspector(inspectorId: string) {
  return devtoolsContext.inspector.find(inspector => inspector.id === inspectorId)
}

export function updateInspector(inspectorId: string, payload: Partial<Inspector>) {
  const inspector = getInspector(inspectorId)
  inspector && Object.assign(inspector, payload)
}
