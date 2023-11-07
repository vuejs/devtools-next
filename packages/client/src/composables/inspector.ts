import type { InjectionKey, Ref } from 'vue'

interface StateEditorContext {
  nodeId: string
  inspectorId: string
}
const StateEditorSymbolKey: InjectionKey<Ref<StateEditorContext>> = Symbol('StateEditorSymbol')

export function createStateEditorContext(initial: StateEditorContext) {
  const context = ref<StateEditorContext>(initial)
  provide(StateEditorSymbolKey, context)
  return {
    context,
  }
}

export function useStateEditorContext() {
  const context = inject(StateEditorSymbolKey)!
  return context
}

export function useStateEditor() {
  const editingText = ref('')
  const editingType = ref<'number' | 'string'>('string')
  const editing = ref(false)

  const state = useStateEditorContext()

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
  }
}
