import { EditStateType } from '../types'
import type {
  EditStateComponentPayload,
  EditStateEventPayload,
  EditStatePayloads,
} from '../types'

function assertType<T extends EditStateType>(
  type: T,
  checkType: EditStateType,
  payload: EditStatePayloads[EditStateType],
): payload is EditStatePayloads[T] {
  return checkType === type
}

async function editComponentState(payload: EditStateComponentPayload) {
  console.log('trigger component update', payload)
}

export async function editState(payload: EditStateEventPayload<EditStateType>) {
  const { type, payload: data } = payload
  if (assertType(EditStateType.Component, type, data))
    await editComponentState(data)
}
