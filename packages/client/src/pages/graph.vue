<script setup lang="ts">
import { useDevToolsBridgeRpc } from '@vue-devtools-next/core'
import { Network } from 'vis-network'
import type { DrawerData } from '~/composables/graph'

const bridgeRpc = useDevToolsBridgeRpc()

onDevToolsClientConnected(async () => {
  const root = await bridgeRpc.root()
  bridgeRpc.getGraph().then((res) => {
    parseGraphRawData(res, root)
  })
})

const container = ref<HTMLDivElement>()
const [drawerShow, toggleDrawer] = useToggle(false)
const drawerData = ref<DrawerData>()

function mountNetwork() {
  const node = container.value!

  const network = new Network(node, { nodes: graphNodes, edges: graphEdges }, graphOptions.value)

  watch(graphOptions, (options) => {
    network.setOptions(options)
  }, { immediate: true })

  network.on('selectNode', (options) => {
    drawerData.value = getDrawerData(options.nodes[0])
    if (drawerData.value)
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
  <div relative flex="~ col" panel-grids h-screen of-hidden class="graph-body">
    <GraphNavbar />
    <div ref="container" flex="1" />
    <GraphFileType />
    <GraphDrawer v-model="drawerShow" to=".graph-body" :drawer-data="drawerData!" />
  </div>
</template>
