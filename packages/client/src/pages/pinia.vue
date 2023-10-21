<script setup lang="ts">
import { onDevToolsClientConnected, useDevToolsBridgeApi } from '@vue-devtools-next/app-core'

// eslint-disable-next-line ts/consistent-type-imports
import type { InspectorState } from '@vue-devtools-next/schema'
import { Pane, Splitpanes } from 'splitpanes'

const bridgeApi = useDevToolsBridgeApi()

const { selected } = createSelectContext('pinia-store-tree')
const tree = ref<{ id: string;label: string }[]>([])
const state = ref<Record<string, InspectorState[]>>({})

function getPiniaState(nodeId: string) {
  bridgeApi.getInspectorState({ inspectorId: 'pinia', nodeId }, ({ data }) => {
    state.value = data.state
  })
}

function selectStore(id: string) {
  getPiniaState(id)
}

createCollapseContext('inspector-state')

onDevToolsClientConnected(() => {
  bridgeApi.getInspectorTree({ inspectorId: 'pinia', filter: '' }, ({ data }) => {
    tree.value = data
    if (!selected.value && data.length) {
      selected.value = data[0].id
      getPiniaState(data[0].id)
    }
  })
})
</script>

<template>
  <div h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <PiniaTree v-for="(item) in tree" :key="item.id" :data="item" @select="selectStore" />
        </div>
      </Pane>
      <Pane flex flex-col overflow-y-scroll class="no-scrollbar">
        <div p-2>
          <InspectorState v-for="(item, key) in state" :id="key" :key="key + Date.now()" :data="item" :name="`${key}`" />
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
