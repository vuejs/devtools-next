<script setup lang="ts">
import { type ModuleInfo, useDevToolsBridgeRpc } from '@vue-devtools-next/core'
import { type Data, Network } from 'vis-network'

const bridgeRpc = useDevToolsBridgeRpc()
const modules = ref<ModuleInfo[]>()
const modulesMap = shallowRef<Map<string, { filePath: string }>>(new Map())

onDevToolsClientConnected(() => {
  bridgeRpc.getGraph().then((res) => {
    modules.value = res
  })
})

const { legendsData, legendShow, toggleLegend } = useLegends()

const isMatched = (id: string) => matchedKeys.value.includes(id)

const container = ref<HTMLDivElement>()

function getFontStyle(id: string) {
  return {
    color: isMatched(id)
      ? '#F19B4A'
      : undefined,
  }
}

const data = computed<Data>(() => {
  const data = modules.value
  if (!data)
    return { node: [], edges: [] }
  const nodes: Data['nodes'] = data.map((mod) => {
    const path = mod.id.replace(/\?.*$/, '').replace(/\#.*$/, '')
    const pathSegments = path.split('/')
    const id = mod.id

    if (!modulesMap.value.has(id))
      modulesMap.value.set(id, { filePath: path })
    else
      modulesMap.value.get(id)!.filePath = path

    return {
      id,
      label: isMatched(id) ? `<b>${pathSegments.at(-1)}</b>` : pathSegments.at(-1),
      group: path.match(/\.(\w+)$/)?.[1] || 'unknown',
      size: 15 + Math.min(mod.deps.length / 2, 8),
      title: path,
      font: getFontStyle(id),
      shape: mod.id.includes('/node_modules/')
        ? 'hexagon'
        : mod.virtual
          ? 'diamond'
          : 'dot',
    }
  })
  const edges: Data['edges'] = data.flatMap(mod => mod.deps.map(dep => ({
    from: mod.id,
    to: dep,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.8,
      },
    },
  })))

  return {
    nodes,
    edges,
  }
})

function buildNetwork() {
  const node = container.value!

  const network = new Network(node, data.value)

  watch(data, (data) => {
    network.setData(data)
  }, { immediate: true })

  watch(graphOptions, (options) => {
    network.setOptions(options)
  }, { immediate: true })
}

onMounted(() => {
  buildNetwork()
})
</script>

<template>
  <div relative flex panel-grids>
    <div ref="container" flex="1" />

    <!-- legends -->
    <div
      absolute bottom-0 px4 py2 rounded-tr-lg w-260px grid gap-2 grid-cols-3 bg-base b-1 border-base
      transition-transform duration-300
      :class="[
        legendShow ? 'translate-y-0' : 'translate-y-full',
      ]"
    >
      <div
        absolute top-0 translate-y="-100%" px4 py1 bg-primary-500 text-white rounded-tr-lg cursor-pointer class="group"
        transition-opacity @click="() => toggleLegend()"
      >
        Legend <div
          :class="[
            legendShow
              ? 'group-hover:translate-y-10% rotate-180'
              : 'group-hover:translate-y--10%',
          ]" transition-transform i-material-symbols:arrow-upward-alt-rounded
        />
      </div>
      <div v-for="item of Object.entries(legendsData)" :key="item[1][0]" flex gap-2 items-center>
        <div
          rounded-full w12px h12px :style="{
            backgroundColor: item[1][1].color,
          }"
        />
        <span>{{ item[1][0] }}</span>
      </div>
    </div>
  </div>
</template>

<style>
.vis-tooltip {
  --at-apply: border-base p1 absolute b-1 backdrop-blur-md rounded-lg shadow-lg;
}
</style>
