<script setup lang="ts">
import { useDevToolsBridgeRpc } from '@vue/devtools-core'
import { Network } from 'vis-network'

const bridgeRpc = useDevToolsBridgeRpc()

async function fetch() {
  const root = await bridgeRpc.root()
  bridgeRpc.getGraph().then((res) => {
    parseGraphRawData(res, root)
  })
}

let cleanupModuleUpdatedEffect: Function

onDevToolsClientConnected(() => {
  fetch()
  cleanupModuleUpdatedEffect = bridgeRpc.graphModuleUpdated(() => {
    fetch()
  })

  // createRPCClient('vite-plugin-inspect', (await getViteHotContext())!, {
  //   async moduleUpdated() {
  //     console.log('love from vite-plugin-inspect')
  //     try {
  //       const root = await bridgeRpc.root()
  //       console.log('root => ', root)
  //     }
  //     catch (error) {
  //       console.log('root error => ', error)
  //     }
  //   },
  // }, {
  //   timeout: -1,
  // })
})

const container = ref<HTMLDivElement>()
const networkRef = shallowRef<Network>()

function mountNetwork() {
  const node = container.value!

  const network = networkRef.value = new Network(node, { nodes: graphNodes, edges: graphEdges }, graphOptions.value)

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

  watch(() => graphFilterNodeId.value, (id) => {
    if (id)
      network.moveTo({ position: { x: 0, y: 0 } })
  })
}

onMounted(() => {
  mountNetwork()
})

onUnmounted(() => {
  cleanupGraphRelatedStates()
  networkRef.value?.destroy()
  cleanupModuleUpdatedEffect?.()
})

const navbarRef = ref<HTMLElement>()
</script>

<template>
  <div flex="~ col" relative h-screen of-hidden panel-grids class="graph-body">
    <GraphNavbar ref="navbarRef" />
    <div ref="container" flex="1" />
    <GraphFileType />
    <GraphDrawer :top="navbarRef" />
  </div>
</template>
