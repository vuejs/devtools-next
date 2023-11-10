import type { AppRecord } from '@vue-devtools-next/schema'
import type { Recordable } from '../state/editor'

export type PropPath = string | string[]

export interface InspectorStateEditorPayload {
  app?: AppRecord['app']
  inspectorId: string
  nodeId: string
  type: string
  path: PropPath
  state: {
    value: unknown
    newKey: string
    remove?: boolean
  }
  set?: (
    obj: Recordable,
    path: PropPath,
    value: unknown,
    cb?: (object: Recordable, field: string, value: unknown) => void
  ) => unknown
}
