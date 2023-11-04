import type { PluginApi } from '@vue-devtools-next/schema'
import { StateEditor } from '../../shared/edit'
import { editComponentState } from './component'
import { EditStateType } from './types'
import type {
  EditStateEventPayload,
  EditStatePayloads,
} from './types'

function assertType<T extends EditStateType>(
  type: T,
  checkType: EditStateType,
  _payload: EditStatePayloads[EditStateType],
): _payload is EditStatePayloads[T] {
  return checkType === type
}

export const stateEditor = new StateEditor()

// TODO: currently (w/ Vue official devtools), we send all state to frontend after changes,
//       we can optimize this by only sending the changed state, to make a better UX.
// PRIORITY: LOW
export async function editState(payload: EditStateEventPayload<EditStateType>, api: PluginApi) {
  const { type, payload: data } = payload
  if (assertType(EditStateType.Component, type, data))
    editComponentState(data, stateEditor, api)
}
