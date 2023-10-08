import { computed, ref } from 'vue'
import type { ComponentTreeNode } from '@vue-devtools-next/schema'

const componentExpandedMap = ref<Record<string, boolean>>({})

const selectedComponent = ref<string>('')

function initExpandedComponent(treeNode: ComponentTreeNode[]) {
  if (!treeNode.length)
    return
  if (!Object.keys(componentExpandedMap.value).length) {
    // expand root and its children
    componentExpandedMap.value = {
      [treeNode?.[0].id]: true,
      ...treeNode?.[0].children?.reduce((acc, cur) => {
        acc[cur.id] = true
        return acc
      }, {}),
    }
  }
}
function initSelectedComponent(treeNode: ComponentTreeNode[]) {
  if (!treeNode.length)
    return
  if (!selectedComponent.value)
    selectedComponent.value = treeNode?.[0].id
}

export function initComponentTreeState(treeNode: ComponentTreeNode[]) {
  initExpandedComponent(treeNode)
  initSelectedComponent(treeNode)
}

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
