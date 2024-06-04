<script setup lang="ts">
import { ref, watch } from 'vue'
import { onRpcConnected, rpc } from '@vue/devtools-core'
import Home from './components/Home.vue'
import Routes from './components/routes/Index.vue'
import Timeline from './components/timeline/Index.vue'
import { registerVirtualRouter } from '~/composables/virtual-router'
import { createCustomInspectorStateContext } from '~/composables/custom-inspector-state'

const props = defineProps<{
  id: string
}>()
const inspectorState = createCustomInspectorStateContext()
const loading = ref(false)
const { VirtualRouterView, restoreRouter } = registerVirtualRouter([
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'i-ri-route-line',
  },
  {
    path: '/routes',
    name: 'Routes',
    component: Routes,
    icon: 'i-carbon-tree-view-alt',
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: Timeline,
    icon: 'i-mdi:timeline-clock-outline',
  },
])

function getInspectorInfo() {
  loading.value = true
  onRpcConnected(() => {
    rpc.value.getInspectorInfo(props.id).then((payload) => {
      if (!payload) {
        return
      }
      const state = {
        homepage: payload?.homepage,
        id: payload?.id,
        label: payload?.label,
        logo: payload?.logo,
        timelineLayerIds: payload?.timelineLayers.map(item => item.id),
      }
      inspectorState.value = state
      restoreRouter()
      loading.value = false
    })
  })
}

watch(() => props.id, (v) => {
  if (v) {
    getInspectorInfo()
  }
})
</script>

<template>
  <div h-full w-full>
    <VirtualRouterView />
  </div>
</template>
