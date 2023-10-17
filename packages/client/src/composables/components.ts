import { useDevToolsBridgeApi } from '@vue-devtools-next/app-core'
import type { ComponentState, ComponentTreeNode } from '@vue-devtools-next/schema'
import { ref } from 'vue'
import { parse } from 'vue-devtools-kit/shared'

const bridgeApi = useDevToolsBridgeApi()

const selectedComponent = ref<string>('')

const activeComponentState = ref<Record<string, ComponentState[]>>({})

function normalizeComponentState(state: string) {
  const parsedState: { state: ComponentState[] } = parse(state)
  const res = {}
  parsedState.state.forEach((item) => {
    if (!res[item.type])
      res[item.type] = []
    res[item.type].push(item)
  })
  return res
}

export function normalizeComponentTreeCollapsed(treeNode: ComponentTreeNode[]) {
  return {
    [treeNode[0].id]: true,
    ...treeNode?.[0].children?.reduce((acc, cur) => {
      acc[cur.id] = true
      return acc
    }, {}),
  }
}

function checkComponentInTree(treeNode: ComponentTreeNode[], id: string) {
  if (!treeNode.length)
    return false
  if (treeNode.find(item => item.id === id))
    return true
  return treeNode.some(item => checkComponentInTree(item.children || [], id))
}

function getComponentState(id: string) {
  bridgeApi.getInstanceState({ instanceId: id }, ({ data }) => {
    activeComponentState.value = normalizeComponentState(data)
  })
}

export function initSelectedComponent(treeNode: ComponentTreeNode[]) {
  if (!treeNode.length)
    return
  if (!selectedComponent.value) {
    selectedComponent.value = treeNode?.[0].id
    getComponentState(treeNode?.[0].id)
  }
  else {
    // fallback to root if selected component is not in the tree
    if (!checkComponentInTree(treeNode, selectedComponent.value)) {
      selectedComponent.value = treeNode?.[0].id
      getComponentState(treeNode?.[0].id)
    }
  }
}

export function useSelectComponent() {
  function selectComponent(id: string) {
    selectedComponent.value = id
    getComponentState(id)
  }

  return {
    selectedComponent,
    selectComponent,
  }
}

export function useComponentState() {
  return {
    activeComponentState,
  }
}
