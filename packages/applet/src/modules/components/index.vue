<script setup lang="ts">
import { ref } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import type { ComponentTreeNode, InspectorState } from '@vue/devtools-kit'
import { getInspectorState, getInspectorTree, onInspectorStateUpdated } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import ComponentTree from '~/components/tree/TreeViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'
import { createSelectedContext } from '~/composables/select'
import RootStateViewer from '~/components/state/RootStateViewer.vue'

const inspectorId = 'components'
const tree = ref<ComponentTreeNode[]>([])
const activeComponentState = ref<Record<string, InspectorState[]>>({})
const activeComponentId = ref('')

createExpandedContext()
createSelectedContext()

function getPiniaInspectorTree() {
  getInspectorTree({ inspectorId, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    getComponentState(tree.value?.[0].id)
    console.log('x', tree.value)
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

onInspectorStateUpdated((data) => {
  if (data.inspectorId !== inspectorId)
    return

  activeComponentState.value = normalizeComponentState({ state: data.state })
})

getPiniaInspectorTree()
</script>

<template>
  <div class="h-full w-full">
    <Splitpanes class="flex-1 overflow-auto">
      <Pane border="r base" h-full>
        <div h-full select-none overflow-scroll p2 class="no-scrollbar">
          <ComponentTree :data="tree" />
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
