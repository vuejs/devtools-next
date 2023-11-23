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
const [drawerShow, toggleDrawer] = useToggle(false)

function mountNetwork() {
  const node = container.value!

  const network = new Network(node, { nodes: graphNodes, edges: graphEdges }, graphOptions.value)

  watch(graphOptions, (options) => {
    network.setOptions(options)
  }, { immediate: true })

  network.on('selectNode', () => {
    toggleDrawer(true)
  })

  network.on('deselectNode', () => {
    toggleDrawer(false)
  })
}

onMounted(() => {
  mountNetwork()
})
</script>

<template>
  <div relative flex="~ col" panel-grids h-screen of-hidden>
    <GraphNavbar />
    <div class="graph-body" relative h-screen of-hidden flex="~ col 1">
      <div ref="container" flex="1" />
      <GraphFileType />
      <GraphDrawer v-model="drawerShow" to=".graph-body" />
    </div>
  </div>
</template>

<style>
.vis-tooltip {
  --at-apply: border-base p1 absolute b-1 bg-base rounded-lg shadow-lg text-base;
}
</style>
