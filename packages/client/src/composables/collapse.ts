import { computed, ref } from 'vue'
import type { Ref } from 'vue'

export function createCollapseContext(id: string) {
  const collapseMap = ref<Record<string, boolean>>({})
  const linkedList = ref<Record<string, string[]>>({})

  provide<Ref<Record<string, boolean>>>(`CollapseMapSymbol${id}`, collapseMap)
  provide<Ref<Record<string, string[]>>>(`CollapseMapSymbol${id}LinkedList`, linkedList)
  return {
    collapseMap,
    id,
    linkedList,
  }
}

function useCollapseContext(id: string) {
  const collapseMap = inject<Ref<Record<string, boolean>>>(`CollapseMapSymbol${id}`)!
  const linkedList = inject<Ref<Record<string, string[]>>>(`CollapseMapSymbol${id}LinkedList`)!
  return {
    collapseMap,
    linkedList,
    id,
  }
}

export function useCollapse(groupId: string, id: string, linkedList?: string[]) {
  const { collapseMap, linkedList: _linkedList } = useCollapseContext(groupId)
  const isExpanded = computed(() => collapseMap.value[id] ?? false)
  const toggleCollapse = () => {
    collapseMap.value[id] = !collapseMap.value[id]
  }

  if (linkedList?.length)
    _linkedList.value[id] = linkedList ?? []

  return {
    isExpanded,
    toggleCollapse,
  }
}
