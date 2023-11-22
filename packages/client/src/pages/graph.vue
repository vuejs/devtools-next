<script setup lang="ts">
import { useDevToolsBridgeRpc } from '@vue-devtools-next/core'
import { Network } from 'vis-network'

const bridgeRpc = useDevToolsBridgeRpc()

onDevToolsClientConnected(async () => {
  const root = await bridgeRpc.root()
  bridgeRpc.getGraph().then((res) => {
    parseGraphRawData(res, root)
  })
})

const container = ref<HTMLDivElement>()

function mountNetwork() {
  const node = container.value!

  const network = new Network(node, { nodes: graphNodes, edges: graphEdges }, graphOptions.value)

  watch(graphOptions, (options) => {
    network.setOptions(options)
  }, { immediate: true })
}

onMounted(() => {
  mountNetwork()
})
</script>

<template>
  <div relative flex="~ col" panel-grids>
    <GraphNavbar />
    <div ref="container" flex="1" />
    <GraphLegends />
  </div>
</template>

<style>
.vis-tooltip {
  --at-apply: border-base p1 absolute b-1 bg-base rounded-lg shadow-lg text-base;
}
</style>
