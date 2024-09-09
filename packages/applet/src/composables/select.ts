import { inject, provide, ref } from 'vue'
import type { InjectionKey, Ref } from 'vue'

const SelectedSymbolKey: InjectionKey<Ref<string>> = Symbol('SelectedSymbolKey')

export function createSelectedContext() {
  const selected = ref<string>('')

  provide<Ref<string>>(SelectedSymbolKey, selected)

  return {
    selected,
  }
}

export function useSelect() {
  const selected = inject<Ref<string>>(SelectedSymbolKey, ref(''))!

  function select(value: string) {
    selected.value = value
  }

  return {
    selected,
    select,
  }
}
