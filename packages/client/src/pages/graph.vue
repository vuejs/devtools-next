<script setup lang="ts">
import { callViteServerAction, defineViteClientListener } from '@vue/devtools-core'
import { Network } from 'vis-network'
import type { ModuleInfo } from '@vue/devtools-core'

const getRoot = callViteServerAction<string>('get-vite-root')
const getGraph = callViteServerAction<ModuleInfo[]>('graph:get-modules')

const onModuleUpdated = defineViteClientListener('graph:module-updated')

async function fetchGraph() {
  const root = await getRoot()
  getGraph().then((res) => {
    parseGraphRawData(res, root)
  })
}

let cleanupModuleUpdatedEffect: Function

onDevToolsClientConnected(() => {
  fetchGraph()
  cleanupModuleUpdatedEffect = onModuleUpdated(() => {
    fetchGraph()
  })
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
