<script setup lang="ts">
import { useDevToolsBridgeRpc, useDevToolsState } from '@vue-devtools-next/core'

import type { InspectorState } from 'vue-devtools-kit'
import { Pane, Splitpanes } from 'splitpanes'

const bridgeRpc = useDevToolsBridgeRpc()

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
  bridgeRpc.getInspectorState({ inspectorId: inspectorId.value, nodeId }).then(({ data }) => {
    state.value = data
  })
}

watch(selected, () => {
  getRouterState(selected.value)
})

onDevToolsClientConnected(() => {
  bridgeRpc.getInspectorTree({ inspectorId: inspectorId.value, filter: '' }).then(({ data }) => {
    tree.value = data
    if (!selected.value && data.length) {
      selected.value = data[0].id
      getRouterState(data[0].id)
    }
  })

  bridgeRpc.on.inspectorTreeUpdated((data) => {
    if (!data?.data?.length)
      return
    tree.value = data.data
    if (!selected.value && data.data.length) {
      selected.value = data.data[0].id
      getRouterState(data.data[0].id)
    }
  }, {
    inspectorId: inspectorId.value,
  })

  bridgeRpc.on.inspectorStateUpdated((data) => {
    if (!data || !data.state || data.inspectorId !== inspectorId.value)
      return

    state.value = data
  }, {
    inspectorId: inspectorId.value,
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
        <div h-0 grow overflow-auto p-2 class="no-scrollbar">
          <InspectorState
            v-for="(item, key) in state" :id="key"
            :key="key + Date.now()" :data="item" :name="`${key}`"
            inspector-id="router"
          />
        </div>
      </Pane>
    </Splitpanes>
  </PanelGrids>
</template>
