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

  network.on('selectNode', (options) => {
    updateGraphDrawerData(options.nodes[0])
    toggleGraphDrawer(true)
  })

  network.on('deselectNode', () => {
    toggleGraphDrawer(false)
  })
}

onMounted(() => {
  mountNetwork()
})
</script>

<template>
  <div relative flex="~ col" panel-grids h-screen of-hidden class="graph-body">
    <GraphNavbar />
    <div ref="container" flex="1" />
    <GraphFileType />
    <GraphDrawer to=".graph-body" />
  </div>
</template>
