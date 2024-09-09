import { ref } from 'vue'
import type { Ref } from 'vue'

export function createSelectContext(id: string) {
  const selected = ref<string>('')

  provide<Ref<string>>(`SelectedSymbol${id}`, selected)
  return {
    selected,
    id,
  }
}

function useSelectContext(id: string) {
  const selected = inject<Ref<string>>(`SelectedSymbol${id}`)!
  return {
    selected,
    id,
  }
}

export function useSelect(groupId: string, id: string, onSelect?: (id: string) => void) {
  const { selected } = useSelectContext(groupId)
  const isSelected = computed(() => selected.value === id)
  const toggleSelected = (id: string) => {
    selected.value = id
    onSelect?.(id)
  }
  return {
    isSelected,
    toggleSelected,
  }
}

export function useSelectWithContext(groupId: string, id: string, onSelect?: (id: string) => void) {
  const { selected } = useSelectContext(groupId)
  const isSelected = computed(() => selected.value === id)
  const toggleSelected = (id: string) => {
    selected.value = id
    onSelect?.(id)
  }
  return {
    isSelected,
    toggleSelected,
  }
}
