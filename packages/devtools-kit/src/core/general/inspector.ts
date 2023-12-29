import type { DevToolsContext } from '@vue/devtools-next-schema'
import { devtoolsContext } from './state'

export function addInspector(payload: DevToolsContext['inspector'][0]) {
  devtoolsContext.inspector.push(payload)
}

export function getInspector(inspectorId: string) {
  return devtoolsContext.inspector.find(inspector => inspector.id === inspectorId)
}

export function updateInspector(inspectorId: string, payload: Partial<DevToolsContext['inspector'][0]>) {
  const inspector = getInspector(inspectorId)
  inspector && Object.assign(inspector, payload)
}
