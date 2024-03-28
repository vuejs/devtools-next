<script setup lang="ts">
import { getInspectorState, getInspectorTree, onEditInspectorState, onInspectorStateUpdated, onInspectorTreeUpdated } from '@vue/devtools-core'
import { parse } from '@vue/devtools-kit'
import type { InspectorState, InspectorTree } from '@vue/devtools-kit'
import { Pane, Splitpanes } from 'splitpanes'

const inspectorId = 'vuex'

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
  getInspectorState({ inspectorId: 'vuex', nodeId }).then((data) => {
    state.value = parse(data!)
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

createCollapseContext('inspector-state')
createSelectContext('inspector-state')

const selectVuexTree = (id: string) => {
  selected.value = id
}

onDevToolsClientConnected(() => {
  getInspectorTree({ inspectorId: 'vuex', filter: '' }).then((_data) => {
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
})
</script>

<template>
  <PanelGrids h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <ComponentTreeNode v-for="item in tree" :key="item.id" :data="item" group-id="inspector-state" @select="selectVuexTree" />
        </div>
      </Pane>
      <Pane flex flex-col>
        <div :key="selected" h-0 grow overflow-auto p-2 class="no-scrollbar">
          <InspectorState
            v-for="(item, key) in state" :id="key"
            :key="key"
            inspector-id="vuex"
            :node-id="selected" :data="item" :name="`${key}`"
          />
        </div>
      </Pane>
    </Splitpanes>
  </PanelGrids>
</template>
