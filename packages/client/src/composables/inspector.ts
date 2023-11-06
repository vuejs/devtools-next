import { Bridge, BridgeEvents } from '@vue-devtools-next/core'
import type { EditStateEventPayload, EditStatePayloads, EditStateType } from 'vue-devtools-kit'
import type { InjectionKey, Ref } from 'vue'

const StateEditorSymbolKey: InjectionKey<Ref<{
  type: EditStateType
  nodeId: string
}>> = Symbol('StateEditorSymbol')

export function createStateEditorContext(initial: {
  type: EditStateType
  nodeId: string
}) {
  const context = ref<{
    type: EditStateType
    nodeId: string
  }>(initial)
  provide(StateEditorSymbolKey, context)
  return {
    context,
  }
}

export function useStateEditorContext() {
  const context = inject(StateEditorSymbolKey)!
  return context
}

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

export function useStateEditor() {
  const editingText = ref('')
  const editingType = ref<'number' | 'string'>('string')
  const editing = ref(false)

  const state = useStateEditorContext()
  const { sendEdit } = useEditState(state.value.type)

  return {
    editingText,
    editing,
    toggleEditing(t?: 'number' | 'string') {
      if (t)
        editingType.value = t
      editing.value = !editing.value
    },
    editingType,
    nodeId: state.value.nodeId,
    sendEdit,
  }
}
