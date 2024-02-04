import type { InjectionKey, Ref } from 'vue'

interface StateEditorContext {
  nodeId: string
  inspectorId: string
  disableEdit: boolean
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

export type EditorInputValidType = 'number' | 'string' | 'object' | 'null'
export type EditorAddNewPropType = 'object' | 'array'

export function useStateEditor() {
  const editingText = ref('')
  const editingType = ref<EditorInputValidType>('string')
  const editing = ref(false)

  const state = useStateEditorContext()

  return {
    editingText,
    editing,
    toggleEditing(t?: EditorInputValidType) {
      if (t)
        editingType.value = t
      editing.value = !editing.value
    },
    editingType,
    nodeId: state.value.nodeId,
  }
}

function getNextAvailableKey(type: EditorAddNewPropType, data: any) {
  if (type === 'array') {
    const len = (data as any[]).length
    return len
  }
  const prefix = 'newProp'
  let i = 1
  while (true) {
    const key = `${prefix}${i}`
    if (!data[key])
      return key
    i++
  }
}

export function useStateEditorDrafting() {
  const draftingNewProp = ref({
    enable: false,
    key: '',
    value: 'undefined',
  })

  function addNewProp(type: EditorAddNewPropType, data: any) {
    const key = getNextAvailableKey(type, data)
    draftingNewProp.value = {
      enable: true,
      key: key.toString(),
      value: 'undefined',
    }
  }

  function resetDrafting() {
    draftingNewProp.value = {
      enable: false,
      key: '',
      value: 'undefined',
    }
  }

  return {
    addNewProp,
    resetDrafting,
    draftingNewProp,
  }
}
