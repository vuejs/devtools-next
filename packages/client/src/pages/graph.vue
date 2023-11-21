<script setup lang="ts">
import { useDevToolsBridgeRpc } from '@vue-devtools-next/core'

const bridgeRpc = useDevToolsBridgeRpc()

onDevToolsClientConnected(() => {
  bridgeRpc.getGraph().then((res) => {
    console.log('res', res)
  })
})

const { legendsData, legendShow, toggleLegend } = useLegends()
</script>

<template>
  <div relative w-full h-full>
    Graph

    <!-- legends -->
    <div
      absolute bottom-0 px4 py2 rounded-tr-lg w-260px grid gap-2 grid-cols-3 bg-gray="100/40"
      transition-transform duration-300
      :class="[
        legendShow ? 'translate-y-0' : 'translate-y-full',
      ]"
    >
      <div
        absolute top-0 translate-y="-100%" px4 py1 bg-primary-500 text-white rounded-tr-lg cursor-pointer class="group"
        @click="() => toggleLegend()"
      >
        Legend <div
          :class="[
            legendShow
              ? 'i-material-symbols-arrow-downward-alt group-hover:translate-y-10%'
              : 'i-material-symbols:arrow-upward-alt-rounded group-hover:translate-y--10%',
          ]" transition-transform
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
