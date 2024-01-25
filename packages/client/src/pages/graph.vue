<script setup lang="ts">
import { useDevToolsBridgeRpc } from '@vue/devtools-core'
import { Network } from 'vis-network'
import { getViteHotContext } from '~/main'

const bridgeRpc = useDevToolsBridgeRpc()

onDevToolsClientConnected(async () => {
  const root = await bridgeRpc.root()
  bridgeRpc.getGraph().then((res) => {
    parseGraphRawData(res, root)
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

async function testModuleUpdate() {
  const hotContext = await getViteHotContext()
  if (hotContext) {
    console.log('inner-hot-context')
    hotContext.on('test-module-update', () => {
      console.log('inner-client-test-module-update')

      // doesn't work
      bridgeRpc
        .root()
        .then(r => console.log('bridgeRpc root => ', r))
        .catch(e => console.log('bridgeRpc root error => ', e))

      // work
      // fetch('http://httpbin.org/get?abc=def')
      //   .then(r => r.json())
      //   .then(console.log)
    })
  }
}

testModuleUpdate()

onMounted(() => {
  mountNetwork()
})

onUnmounted(() => {
  cleanupGraphRelatedStates()
  networkRef.value?.destroy()
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
