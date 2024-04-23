<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Pane, Splitpanes } from 'splitpanes'
import { getInspectorState, getInspectorTree, onInspectorStateUpdated, onInspectorTreeUpdated } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import type { InspectorNodeTag, InspectorState } from '@vue/devtools-kit'
import Navbar from '../Navbar.vue'
import SelectiveList from '~/components/basic/SelectiveList.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'
import Empty from '~/components/basic/Empty.vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'
import { useDevToolsState } from '~/composables/devtools-state'

const { expanded: expandedStateNodes } = createExpandedContext('routes-state')

const devtoolsState = useDevToolsState()

const inspectorId = computed(() => {
  const item = devtoolsState.appRecords.value.find(app => app.id === devtoolsState.activeAppRecordId.value)
  return `router-inspector:${item?.routerId ?? 0}`
})

const selected = ref('')
const tree = ref<{ id: string, label: string, tags: InspectorNodeTag[] }[]>([])
const state = ref<{
  state?: InspectorState[]
  getters?: InspectorState[]
}>({})

function filterEmptyState(data: Record<string, unknown[] | string | undefined>) {
  for (const key in data) {
    if (!data[key]?.length)
      delete data[key]
  }
  return data
}

function getRoutesState(nodeId: string) {
  getInspectorState({ inspectorId: inspectorId.value, nodeId }).then((data) => {
    state.value = filterEmptyState(parse(data!))
    expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
  })
}

function clearRoutesState() {
  state.value = {}
}

watch(selected, () => {
  clearRoutesState()
  getRoutesState(selected.value)
})

const getRoutesInspectorTree = () => {
  getInspectorTree({ inspectorId: inspectorId.value, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    if (!selected.value && data.length)
      selected.value = data[0].id
    getRoutesState(data[0].id)
  })
}
getRoutesInspectorTree()

onInspectorTreeUpdated((data) => {
  if (!data?.data.length || data.inspectorId !== inspectorId.value)
    return
  tree.value = data.data as unknown as { id: string, label: string, tags: InspectorNodeTag[] }[]
  if (!selected.value && data.data.length) {
    selected.value = data.data[0].id
    getRoutesState(data.data[0].id)
  }
})

onInspectorStateUpdated((data) => {
  if (!data || !data?.state?.length || data.inspectorId !== inspectorId.value)
    return

  state.value = filterEmptyState(data!)
  expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
})
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader doc-link="https://router.vuejs.org/" github-repo-link="https://github.com/vuejs/router">
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
          <RootStateViewer v-if="selected" class="p3" :data="state" node-id="" inspector-id="router" expanded-state-id="routes-state" />
          <Empty v-else>
            No Data
          </Empty>
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
