import { useDevToolsBridgeApi } from '@vue-devtools-next/app-core'
import type { ComponentState, ComponentTreeNode } from '@vue-devtools-next/schema'
import { computed, ref } from 'vue'
import { parse } from 'vue-devtools-kit/shared'

const bridgeApi = useDevToolsBridgeApi()

const componentTreeExpandedMap = ref<Record<string, boolean>>({})
const componentStateExpandedMap = ref<Record<string, boolean>>({})

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

function getComponentState(id: string) {
  bridgeApi.getInstanceState({ instanceId: id }, ({ data }) => {
    activeComponentState.value = normalizeComponentState(data)
    const defaultExpandedId = Object.keys(activeComponentState.value)[0]
    componentStateExpandedMap.value = {
      [defaultExpandedId]: true,
    }
  })
}

function initExpandedComponent(treeNode: ComponentTreeNode[]) {
  if (!treeNode.length)
    return
  if (!Object.keys(componentTreeExpandedMap.value).length) {
    // expand root and its children
    componentTreeExpandedMap.value = {
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
  if (!selectedComponent.value) {
    selectedComponent.value = treeNode?.[0].id
    getComponentState(treeNode?.[0].id)
  }
}

export function initComponentTreeState(treeNode: ComponentTreeNode[]) {
  initExpandedComponent(treeNode)
  initSelectedComponent(treeNode)
}

export function useToggleComponentTreeExpanded(id: string) {
  const isExpanded = computed(() => componentTreeExpandedMap.value[id] || false)

  function toggleExpanded() {
    componentTreeExpandedMap.value[id] = !componentTreeExpandedMap.value[id]
  }

  return {
    isExpanded,
    toggleExpanded,
  }
}

export function useToggleComponentStateExpanded(id: string) {
  const isExpanded = computed(() => componentStateExpandedMap.value[id] || false)

  function toggleExpanded() {
    componentStateExpandedMap.value[id] = !componentStateExpandedMap.value[id]
  }

  return {
    isExpanded,
    toggleExpanded,
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
