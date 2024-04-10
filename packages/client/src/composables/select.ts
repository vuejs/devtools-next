import type { Ref } from 'vue'
import { ref } from 'vue'
import { promiseTimeout } from '@vueuse/core'

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

export function useScrollSelectedIntoView(nodeEl: Ref<HTMLDivElement | undefined>, isSelected: ComputedRef<boolean>) {
  whenever(isSelected, async () => {
    await promiseTimeout(100)

    const parentEl = nodeEl.value?.parentElement
    if (!parentEl || !nodeEl.value)
      return

    const bounds = nodeEl.value.getBoundingClientRect()
    const parentBounds = parentEl.getBoundingClientRect()

    const isNodeVisible = bounds.top >= parentBounds.top && bounds.bottom <= parentBounds.bottom
    if (!isNodeVisible) {
      parentEl?.scrollBy({
        top: bounds.top - parentBounds.top - parentBounds.height / 2 + bounds.height / 2,
        behavior: 'smooth',
      })
    }
  })
}
