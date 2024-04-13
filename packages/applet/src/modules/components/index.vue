<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import type { ComponentTreeNode, InspectorState } from '@vue/devtools-kit'
import { getInspectorState, getInspectorTree, onInspectorStateUpdated } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import { useElementSize } from '@vueuse/core'
import ComponentTree from '~/components/tree/TreeViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'
import { createSelectedContext } from '~/composables/select'
import RootStateViewer from '~/components/state/RootStateViewer.vue'

// responsive layout
const splitpanesRef = ref<HTMLDivElement>()
const splitpanesReady = ref(false)
const { width: splitpanesWidth } = useElementSize(splitpanesRef)
// prevent `Splitpanes` layout from being changed before it ready
const horizontal = computed(() => splitpanesReady.value ? splitpanesWidth.value < 700 : false)

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

function getTargetLinkedNodes(list: string[][], target: string) {
  const nodes: string[] = []
  list.forEach((item) => {
    const index = item.indexOf(target)
    if (index !== -1)
      nodes.push(...item.slice(0, index + 1))
  })
  return [...new Set(nodes)]
}

const inspectorId = 'components'
const tree = ref<ComponentTreeNode[]>([])
const treeNodeLinkedList = computed(() => tree.value?.length ? dfs(tree.value?.[0]) : [])
const activeComponentState = ref<Record<string, InspectorState[]>>({})
const activeComponentId = ref('')

const { expanded: expandedTreeNodes } = createExpandedContext()
createSelectedContext()

function getComponentsInspectorTree() {
  getInspectorTree({ inspectorId, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    activeComponentId.value = tree.value?.[0]?.id
    expandedTreeNodes.value = getNodesByDepth(treeNodeLinkedList.value, 1)
  })
}

function normalizeComponentState(data: { state?: InspectorState[] }) {
  if (!data || !data?.state)
    return {}
  const res = {}
  data.state.forEach((item) => {
    if (!res[item.type])
      res[item.type] = []
    res[item.type].push(item)
  })
  return res
}

function getComponentState(id: string) {
  getInspectorState({ inspectorId, nodeId: id }).then((data) => {
    activeComponentState.value = normalizeComponentState(parse(data!))
  })
}

watch(activeComponentId, (id) => {
  getComponentState(id)
})

onInspectorStateUpdated((data) => {
  if (data.inspectorId !== inspectorId)
    return

  activeComponentState.value = normalizeComponentState({ state: data.state })
})

getComponentsInspectorTree()
</script>

<template>
  <div class="h-full w-full">
    <Splitpanes ref="splitpanesRef" class="flex-1 overflow-auto" :horizontal="horizontal" @ready="splitpanesReady = true">
      <Pane border="r base" h-full>
        <div h-full select-none overflow-scroll p2 class="no-scrollbar">
          <ComponentTree v-model="activeComponentId" :data="tree" />
        </div>
      </Pane>
      <Pane>
        <div h-full select-none overflow-scroll p2 class="no-scrollbar">
          <RootStateViewer class="p3" :data="activeComponentState" :node-id="activeComponentId" :inspector-id="inspectorId" />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
