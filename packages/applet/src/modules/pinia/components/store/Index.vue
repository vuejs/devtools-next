<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import { getInspectorState, getInspectorTree, onInspectorStateUpdated, onInspectorTreeUpdated } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import type { InspectorNodeTag, InspectorState } from '@vue/devtools-kit'
import Navbar from '~/components/basic/Navbar.vue'
import SelectiveList from '~/components/basic/SelectiveList.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'
import Empty from '~/components/basic/Empty.vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'

const { expanded: expandedStateNodes } = createExpandedContext('pinia-store-state')

const inspectorId = 'pinia'

const selected = ref('')
const tree = ref<{ id: string, label: string, tags: InspectorNodeTag[] }[]>([])
const state = ref<{
  state?: InspectorState[]
  getters?: InspectorState[]
}>({})

const emptyState = computed(() => !state.value.state?.length && !state.value.getters?.length)

function filterEmptyState(data: Record<string, unknown[] | undefined>) {
  for (const key in data) {
    if (!data[key]?.length)
      delete data[key]
  }
  return data
}

function getPiniaState(nodeId: string) {
  getInspectorState({ inspectorId, nodeId }).then((data) => {
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
  getInspectorTree({ inspectorId, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    if (!selected.value && data.length)
      selected.value = data[0].id
    getPiniaState(data[0].id)
  })
}
getPiniaInspectorTree()

onInspectorTreeUpdated((data) => {
  if (!data?.data.length || data.inspectorId !== inspectorId)
    return
  tree.value = data.data as unknown as { id: string, label: string, tags: InspectorNodeTag[] }[]
  if (!selected.value && data.data.length) {
    selected.value = data.data[0].id
    getPiniaState(data.data[0].id)
  }
})

onInspectorStateUpdated((data) => {
  if (!data || !data?.state?.length || data.inspectorId !== inspectorId)
    return

  state.value = filterEmptyState({
    state: data.state,
    getters: data.getters,
  })
  expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader doc-link="https://pinia.vuejs.org/" github-repo-link="https://github.com/vuejs/pinia">
      <Navbar />
    </DevToolsHeader>
    <Splitpanes class="flex-1 overflow-auto">
      <Pane border="r base" size="40" h-full>
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <SelectiveList v-model="selected" :data="tree" />
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
