<script setup lang="ts">
import { onDevToolsClientConnected, useDevToolsBridgeApi } from '@vue-devtools-next/app-core'

import { Pane, Splitpanes } from 'splitpanes'

const bridgeApi = useDevToolsBridgeApi()

const { selected } = createSelectContext('pinia-store-tree')
const tree = ref<{ id: string;label: string }[]>([])

onDevToolsClientConnected(() => {
  bridgeApi.getInspectorTree({ inspectorId: 'pinia', filter: '' }, ({ data }) => {
    tree.value = data
    if (!selected.value && data.length)
      selected.value = data[0].id
  })
})
</script>

<template>
  <div h-screen>
    <Splitpanes>
      <Pane flex flex-col border="r base">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <PiniaTree v-for="(item) in tree" :key="item.id" :data="item" />
        </div>
      </Pane>
      <Pane flex flex-col overflow-y-scroll class="no-scrollbar">
        <div p-2>
          r
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
