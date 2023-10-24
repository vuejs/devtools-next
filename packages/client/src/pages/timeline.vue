<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes'
import { onDevToolsClientConnected, useDevToolsBridgeRpc } from '@vue-devtools-next/core'

const bridgeRpc = useDevToolsBridgeRpc()
const layers = ref<{
  color: number
  id: string
  label: string
}[]>([])
const { selected } = createSelectContext('timeline-layer')

onDevToolsClientConnected(() => {
  bridgeRpc.getTimelineLayer().then(({ data }) => {
    layers.value = data
    if (!selected.value)
      selected.value = data[0].id
  })
})

function selectLayer() {}
</script>

<template>
  <div>
    <Splitpanes>
      <Pane border="r base" size="20">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          <TimelineLayer v-for="(item) in layers" :key="item.id" :data="item" @select="selectLayer" />
        </div>
      </Pane>
      <Pane border="r base" size="45">
        <div h-screen select-none overflow-scroll class="no-scrollbar">
          <TimelineEvent />
        </div>
      </Pane>
      <Pane size="35">
        <div h-screen select-none overflow-scroll p-2 class="no-scrollbar">
          3
        </div>
      </Pane>
    </Splitpanes>
  </div>
</template>
