import { useDevToolsBridgeApi } from '@vue-devtools-next/app-core'
import type { ComponentTreeNode, InspectorState } from '@vue-devtools-next/schema'
import { ref } from 'vue'

const bridgeApi = useDevToolsBridgeApi()

const activeComponentState = ref<Record<string, InspectorState[]>>({})

function normalizeComponentState(data: { state?: InspectorState[] }) {
  if (!data.state)
    return {}
  const res = {}
  data.state.forEach((item) => {
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

export function checkComponentInTree(treeNode: ComponentTreeNode[], id: string) {
  if (!treeNode.length)
    return false
  if (treeNode.find(item => item.id === id))
    return true
  return treeNode.some(item => checkComponentInTree(item.children || [], id))
}

export function getComponentState(id: string) {
  bridgeApi.getInstanceState({ instanceId: id }, ({ data }) => {
    activeComponentState.value = normalizeComponentState(data)
  })
}

export function useComponentState() {
  return {
    activeComponentState,
  }
}
