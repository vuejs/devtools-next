import type { Ref } from 'vue'
import { inject, provide, ref } from 'vue'

export function createExpandedContext() {
  const expanded = ref<string[]>([])

  provide<Ref<string[]>>(`state-expanded`, expanded)

  return {
    expanded,
  }
}

export function useToggleExpanded() {
  const expanded = inject<Ref<string[]>>(`state-expaned`, ref([]))!

  function toggleExpanded(key: string) {
    const index = expanded.value.indexOf(key)
    if (index === -1)
      expanded.value.push(key)

    else
      expanded.value.splice(index, 1)
  }

  return {
    expanded,
    toggleExpanded,
  }
}
