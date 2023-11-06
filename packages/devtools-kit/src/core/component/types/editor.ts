import type { AppRecord } from '@vue-devtools-next/schema'

export interface InspectorStateEditorPayload {
  app?: AppRecord['app']
  inspectorId: string
  nodeId: string
  type: string
  path: string
  state: {
    value: unknown
    newKey: string
    remove?: boolean
  }
  set?: () => void
}
