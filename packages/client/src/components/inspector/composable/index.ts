import { Bridge, BridgeEvents } from '@vue-devtools-next/core'
import type { EditStateEventPayload, EditStatePayloads, EditStateType } from 'vue-devtools-kit'
import { useContext } from '~/utils/use'

export function useFiledError() {
  const fieldErrors = {}
}

export function useContextMenu() {

}

export const { get: getEditType, set: setEditType } = useContext<EditStateType>('edit-state-type')

export function useEditState<T extends EditStateType>(type: T) {
  return {
    sendEdit(payload: EditStatePayloads[T]) {
      Bridge.value.emit(BridgeEvents.COMPONENT_EDIT_STATE, {
        type,
        payload,
      } satisfies EditStateEventPayload<T>)
    },
  }
}
