<script setup lang="ts">
import { ref, watch } from 'vue'
import { DevToolsMessagingEvents, rpc } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import type { CustomInspectorNode, CustomInspectorState } from '@vue/devtools-kit'
import { Pane, Splitpanes } from 'splitpanes'
import Navbar from '~/components/basic/Navbar.vue'
import TreeViewer from '~/components/tree/TreeViewer.vue'
import RootStateViewer from '~/components/state/RootStateViewer.vue'
import DevToolsHeader from '~/components/basic/DevToolsHeader.vue'
import { createExpandedContext } from '~/composables/toggle-expanded'

const inspectorId = 'vuex'

const { expanded: expandedStateNodes } = createExpandedContext('vuex-store-state')
const selected = ref('')
const tree = ref<CustomInspectorNode[]>([])
const state = ref<CustomInspectorState>({})

function getVuexState(nodeId: string) {
  rpc.value.getInspectorState({ inspectorId, nodeId }).then(([data]) => {
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
  selected.value = id
}

rpc.value.getInspectorTree({ inspectorId, filter: '' }).then(([_data]) => {
  const data = parse(_data!)
  tree.value = data
  if (!selected.value && data.length)
    selected.value = data[0].id
  getVuexState(data[0].id)
})

rpc.functions.on(DevToolsMessagingEvents.INSPECTOR_TREE_UPDATED, (_data: string) => {
  const data = parse(_data) as {
    inspectorId: string
    rootNodes: CustomInspectorNode[]
  }
  if (data.inspectorId !== inspectorId || !data.rootNodes.length)
    return
  tree.value = data.rootNodes as unknown as CustomInspectorNode[]
  if (!selected.value && data.rootNodes.length) {
    selected.value = data.rootNodes[0].id
    getVuexState(data.rootNodes[0].id)
  }
})

rpc.functions.on(DevToolsMessagingEvents.INSPECTOR_STATE_UPDATED, (_data: string) => {
  const data = parse(_data) as {
    inspectorId: string
    state: CustomInspectorState
    nodeId: string
  }

  if (data.inspectorId !== inspectorId)
    return

  const _state = data.state

  state.value = {
    state: _state.state,
    getters: _state.getters || [],
  }
  expandedStateNodes.value = Array.from({ length: Object.keys(state.value).length }, (_, i) => `${i}`)
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
