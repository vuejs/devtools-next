<script setup lang="ts">
import { getInspectorState, getInspectorTree, onInspectorStateUpdated, onInspectorTreeUpdated } from '@vue/devtools-core'

import type { InspectorNodeTag, InspectorState } from '@vue/devtools-kit'
import { parse } from '@vue/devtools-kit'
import { Pane, Splitpanes } from 'splitpanes'

const inspectorId = 'pinia'

const selected = ref('')
const tree = ref<{ id: string, label: string, tags: InspectorNodeTag[] }[]>([])
const state = ref<{
  inspectorId?: string
  state?: InspectorState[]
  getters?: InspectorState[]
}>({})

function getPiniaState(nodeId: string) {
  getInspectorState({ inspectorId, nodeId }).then((data) => {
    state.value = parse(data!)
  })
}

function clearPiniaState() {
  state.value = {}
}

watch(selected, () => {
  clearPiniaState()
  getPiniaState(selected.value)
})

createCollapseContext('inspector-state')

onDevToolsClientConnected(() => {
  getInspectorTree({ inspectorId, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    if (!selected.value && data.length) {
      selected.value = data[0].id
      getPiniaState(data[0].id)
    }
  })

  onInspectorTreeUpdated((_data) => {
    const data = parse(_data)
    if (!data?.data.length || data.inspectorId !== inspectorId)
      return
    tree.value = data.data
    if (!selected.value && data.data.length) {
      selected.value = data.data[0].id
      getPiniaState(data.data[0].id)
    }
  })

  onInspectorStateUpdated((_data) => {
    const data = parse(_data)
    if (!data || !data?.state?.length || data.inspectorId !== inspectorId)
      return

    state.value = {
      state: data.state,
      getters: data.getters,
    }
  })
})
</script>

<template>
  <PanelGrids h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <InspectorTree v-model="selected" :data="tree" />
        </div>
      </Pane>
      <Pane flex flex-col>
        <div :key="selected" h-0 grow overflow-auto p-2 class="no-scrollbar">
          <InspectorState
            v-for="(item, key) in state" :id="key"
            :key="key"
            :inspector-id="inspectorId"
            :node-id="selected" :data="item" :name="`${key}`"
          />
        </div>
      </Pane>
    </Splitpanes>
  </PanelGrids>
</template>
