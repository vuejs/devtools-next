<script setup lang="ts">
import { getInspectorState, getInspectorTree, onInspectorStateUpdated, onInspectorTreeUpdated, useDevToolsState } from '@vue/devtools-core'

import type { InspectorState } from '@vue/devtools-kit'
import { parse } from '@vue/devtools-kit'
import { Pane, Splitpanes } from 'splitpanes'

const selected = ref('')
const tree = ref<{ id: string, label: string }[]>([])
const state = ref<{
  inspectorId?: string
  state?: InspectorState[]
}>({})
const devtoolsState = useDevToolsState()
const inspectorId = computed(() => {
  const item = devtoolsState.appRecords.value.find(app => app.id === devtoolsState.activeAppRecordId.value)
  return `router-inspector:${item?.routerId ?? 0}`
})
createCollapseContext('inspector-state')

function getRouterState(nodeId: string) {
  getInspectorState({ inspectorId: inspectorId.value, nodeId }).then((data) => {
    state.value = parse(data!)
  })
}

function clearRouterState() {
  state.value = {}
}

watch(selected, () => {
  clearRouterState()
  getRouterState(selected.value)
})

onDevToolsClientConnected(() => {
  getInspectorTree({ inspectorId: inspectorId.value, filter: '' }).then((_data) => {
    const data = parse(_data!)
    tree.value = data
    if (!selected.value && data.length) {
      selected.value = data[0].id
      getRouterState(data[0].id)
    }
  })

  onInspectorTreeUpdated((data) => {
    if (!data?.data?.length || data.inspectorId !== inspectorId.value)
      return
    tree.value = data.data as unknown as { id: string, label: string }[]
    if (!selected.value && data.data.length) {
      selected.value = data.data[0].id
      getRouterState(data.data[0].id)
    }
  })

  onInspectorStateUpdated((data) => {
    if (!data || !data.state || data.inspectorId !== inspectorId.value)
      return

    state.value = {
      state: data.state,
    }
  })
})
</script>

<template>
  <div h-screen>
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
            :key="key" :data="item" :name="`${key}`"
            inspector-id="router"
          />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
