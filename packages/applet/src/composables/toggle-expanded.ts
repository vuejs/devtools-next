import type { InjectionKey, Ref } from 'vue'
import { inject, provide, ref } from 'vue'

const ExpandedSymbolKey: InjectionKey<Ref<string>> = Symbol('ExpandedSymbolKey')

export function createExpandedContext() {
  const expanded = ref<string[]>([])

  provide<Ref<string[]>>(ExpandedSymbolKey, expanded)

  return {
    expanded,
  }
}

export function useToggleExpanded() {
  const expanded = inject<Ref<string[]>>(ExpandedSymbolKey, ref([]))!

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
