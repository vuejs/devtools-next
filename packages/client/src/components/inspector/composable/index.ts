import { Bridge, BridgeEvents } from '@vue-devtools-next/core'
import type { EditStateEventPayload, EditStatePayloads, EditStateType } from 'vue-devtools-kit'
import { useContext } from '~/utils/use'

export const { get: getEditData, set: setEditData } = useContext<{
  type: EditStateType
  nodeId: string
}>('edit-state-data')

export function useEditState<T extends EditStateType>(type: T) {
  return {
    sendEdit(payload: EditStatePayloads[T]) {
      Bridge.value.emit(BridgeEvents.EDIT_STATE, {
        type,
        payload,
      } satisfies EditStateEventPayload<T>)
    },
  }
}

export function useEditStateInput() {
  const editingText = ref('')
  const editingType = ref<'number' | 'string'>('string')
  const editing = ref(false)

  const { nodeId, type } = getEditData()!
  const { sendEdit } = useEditState(type)

  return {
    editingText,
    editing,
    toggleEditing(t?: 'number' | 'string') {
      if (t)
        editingType.value = t
      editing.value = !editing.value
    },
    editingType,
    nodeId,
    sendEdit,
  }
}
