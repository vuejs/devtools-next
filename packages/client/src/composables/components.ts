import { computed, ref } from 'vue'

const componentExpandedMap = ref({
  root: true,
})

const selectedComponent = ref('root')

export function useToggleComponentExpanded(id: string) {
  const isExpanded = computed(() => componentExpandedMap.value[id] || false)

  function toggleExpanded() {
    componentExpandedMap.value[id] = !componentExpandedMap.value[id]
  }

  return {
    isExpanded,
    toggleExpanded,
  }
}

export function useSelectComponent() {
  function selectComponent(id: string) {
    selectedComponent.value = id
  }

  return {
    selectedComponent,
    selectComponent,
  }
}
