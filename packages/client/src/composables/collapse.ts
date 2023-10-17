import type { Ref } from 'vue'
import { computed, ref } from 'vue'

export function createCollapseContext(id: string) {
  const collapseMap = ref<Record<string, boolean>>({})

  provide<Ref<Record<string, boolean>>>(`CollapseMapSymbol${id}`, collapseMap)
  return {
    collapseMap,
    id,
  }
}

function useCollapseContext(id: string) {
  const collapseMap = inject<Ref<Record<string, boolean>>>(`CollapseMapSymbol${id}`)!
  return {
    collapseMap,
    id,
  }
}

export function useCollapse(groupId: string, id: string) {
  const { collapseMap } = useCollapseContext(groupId)
  const isExpanded = computed(() => collapseMap.value[id] ?? false)
  const toggleCollapse = () => {
    collapseMap.value[id] = !collapseMap.value[id]
  }
  return {
    isExpanded,
    toggleCollapse,
  }
}
