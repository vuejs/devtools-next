import { inject, provide, ref } from 'vue'
import type { Ref } from 'vue'

const expandedKey = 'expanded-state'

export function createExpandedContext(id = '') {
  const expanded = ref<string[]>([])

  provide<Ref<string[]>>(`${expandedKey}-${id}`, expanded)

  return {
    expanded,
  }
}

export function useToggleExpanded(id = '') {
  const expanded = inject<Ref<string[]>>(`${expandedKey}-${id}`, ref([]))!

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
