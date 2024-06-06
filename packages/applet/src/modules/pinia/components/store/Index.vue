<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import { DevToolsMessagingEvents, rpc } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import type { CustomInspectorNode, CustomInspectorState } from '@vue/devtools-kit'
import Navbar from '~/components/basic/Navbar.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'
import Empty from '~/components/basic/Empty.vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import ComponentTree from '~/components/tree/TreeViewer.vue'

import { createExpandedContext } from '~/composables/toggle-expanded'

const { expanded: expandedTreeNodes } = createExpandedContext()
const { expanded: expandedStateNodes } = createExpandedContext('pinia-store-state')

const inspectorId = 'pinia'

const selected = ref('')
const tree = ref<CustomInspectorNode[]>([])
const treeNodeLinkedList = computed(() => tree.value?.length ? dfs(tree.value?.[0]) : [])
const flattenedTreeNodes = computed(() => flattenTreeNodes(tree.value))
const flattenedTreeNodesIds = computed(() => flattenedTreeNodes.value.map(node => node.id))
const state = ref<Record<string, CustomInspectorState[]>>({})

const emptyState = computed(() => !state.value.state?.length && !state.value.getters?.length)

// tree
function dfs(node: { id: string, children?: { id: string }[] }, path: string[] = [], linkedList: string[][] = []) {
  path.push(node.id)
  if (node.children?.length === 0)
    linkedList.push([...path])

  node.children?.forEach((child) => {
    dfs(child, path, linkedList)
  })
  path.pop()
  return linkedList
}

function getNodesByDepth(list: string[][], depth: number) {
  const nodes: string[] = []
  list.forEach((item) => {
    nodes.push(...item.slice(0, depth + 1))
  })
  return [...new Set(nodes)]
}

function flattenTreeNodes(tree: CustomInspectorNode[]) {
  const res: CustomInspectorNode[] = []
  const find = (treeNode: CustomInspectorNode[]) => {
    treeNode.forEach((item) => {
      res.push(item)
      if (item.children?.length)
        find(item.children)
    })
  }
  find(tree)
  return res
}

function filterEmptyState(data: Record<string, unknown[] | undefined>) {
  for (const key in data) {
    if (!data[key]?.length)
      delete data[key]
  }
  return data
}

function getPiniaState(nodeId: string) {
  rpc.value.getInspectorState({ inspectorId, nodeId }).then((data) => {
    // @ts-expect-error skip type check
    state.value = filterEmptyState(parse(data!))
    expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
  })
}

function clearPiniaState() {
  state.value = {}
}

watch(selected, () => {
  clearPiniaState()
  getPiniaState(selected.value)
})

const getPiniaInspectorTree = () => {
  rpc.value.getInspectorTree({ inspectorId, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    if (!selected.value && data.length) {
      selected.value = data[0].id
      getPiniaState(data[0].id)
      expandedTreeNodes.value = getNodesByDepth(treeNodeLinkedList.value, 1)
    }
  })
}
getPiniaInspectorTree()

function onInspectorTreeUpdated(_data: string) {
  const data = parse(_data) as {
    inspectorId: string
    rootNodes: CustomInspectorNode[]
  }
  if (data.inspectorId !== inspectorId || !data.rootNodes.length)
    return
  tree.value = data.rootNodes as unknown as CustomInspectorNode[]

  if (!flattenedTreeNodesIds.value.includes(selected.value)) {
    selected.value = data.rootNodes[0].id
    expandedTreeNodes.value = getNodesByDepth(treeNodeLinkedList.value, 1)
    getPiniaState(data.rootNodes[0].id)
  }
}

function onInspectorStateUpdated(_data: string) {
  const data = parse(_data) as {
    inspectorId: string
    state: CustomInspectorState
    nodeId: string
  }

  if (data.inspectorId !== inspectorId)
    return

  const _state = data.state

  // @ts-expect-error skip type check
  state.value = filterEmptyState({
    state: _state.state,
    getters: _state.getters,
  })
}

rpc.functions.on(DevToolsMessagingEvents.INSPECTOR_TREE_UPDATED, onInspectorTreeUpdated)

rpc.functions.on(DevToolsMessagingEvents.INSPECTOR_STATE_UPDATED, onInspectorStateUpdated)

onUnmounted(() => {
  rpc.functions.off(DevToolsMessagingEvents.INSPECTOR_TREE_UPDATED, onInspectorTreeUpdated)
  rpc.functions.off(DevToolsMessagingEvents.INSPECTOR_STATE_UPDATED, onInspectorStateUpdated)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader doc-link="https://pinia.vuejs.org/" github-repo-link="https://github.com/vuejs/pinia">
      <Navbar />
    </DevToolsHeader>
    <Splitpanes class="flex-1 overflow-auto">
      <Pane border="r base" size="40" h-full>
        <div h-full select-none overflow-scroll p2 class="no-scrollbar">
          <ComponentTree v-model="selected" :data="tree" />
        </div>
      </Pane>
      <Pane size="60">
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <RootStateViewer v-if="selected && !emptyState" class="p3" :data="state" :node-id="selected" :inspector-id="inspectorId" expanded-state-id="pinia-store-state" />
          <Empty v-else>
            No Data
          </Empty>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
