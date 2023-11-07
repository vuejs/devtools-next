import type { AppRecord } from '@vue-devtools-next/schema'
import type { Recordable } from '../state/editor'

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
  set?: (
    obj: Recordable,
    path: string,
    value: unknown,
    cb?: (object: Recordable, field: string, value: unknown) => void
  ) => unknown
}
