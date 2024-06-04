<script setup lang="ts">
import { ref, watch } from 'vue'
import { getInspectorState, getInspectorTree, onEditInspectorState, onInspectorStateUpdated, onInspectorTreeUpdated } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import type { InspectorState, InspectorTree } from '@vue/devtools-kit'
import { Pane, Splitpanes } from 'splitpanes'
import Navbar from '~/components/basic/Navbar.vue'
import TreeViewer from '~/components/tree/TreeViewer.vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'

const inspectorId = 'vuex'

const { expanded: expandedStateNodes } = createExpandedContext('vuex-store-state')
const selected = ref('')
const tree = ref<Required<InspectorTree>[]>([])
const state = ref<{
  state: InspectorState[]
  getters: InspectorState[]
}>({
  state: [],
  getters: [],
})

function getVuexState(nodeId: string) {
  getInspectorState({ inspectorId, nodeId }).then((data) => {
    state.value = parse(data!)
    expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
  })
}

function clearVuexState() {
  state.value = {
    state: [],
    getters: [],
  }
}

watch(selected, () => {
  clearVuexState()
  getVuexState(selected.value)
})

const selectVuexTree = (id: string) => {
  console.log(id)
  selected.value = id
}

getInspectorTree({ inspectorId, filter: '' }).then((_data) => {
  const data = parse(_data!)
  tree.value = data

  if (!selected.value && data.length) {
    selected.value = data[0].id
    getVuexState(data[0].id)
  }
})

onInspectorTreeUpdated((data) => {
  if (!data?.data.length || data.inspectorId !== inspectorId)
    return
  tree.value = data.data as unknown as Required<InspectorTree>[]
  if (!selected.value && data.data.length) {
    selected.value = data.data[0].id
    getVuexState(data.data[0].id)
  }
})

onEditInspectorState((payload) => {
  if (payload.inspectorId !== inspectorId)
    return
  getVuexState(selected.value)
})

onInspectorStateUpdated((data) => {
  if (!data || !data?.state?.length || data.inspectorId !== inspectorId)
    return
  state.value = {
    state: data.state,
    getters: data.getters || [],
  }
})
</script>

<template>
  <div class="h-full flex flex-col">
    <DevToolsHeader doc-link="https://vuex.vuejs.org/" github-repo-link="https://github.com/vuejs/vuex">
      <Navbar />
    </DevToolsHeader>
    <Splitpanes class="flex-1 overflow-auto">
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <TreeViewer v-model="selected" :data="tree" />
        </div>
      </Pane>
      <Pane size="60">
        <div h-full select-none overflow-scroll class="no-scrollbar">
          <RootStateViewer class="p3" :data="state" :node-id="selected" :inspector-id="inspectorId" expanded-state-id="vuex-store-state" />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
