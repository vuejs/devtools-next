<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { onRpcConnected, rpc } from '@vue/devtools-core'

import Home from './components/Home.vue'
import State from './components/state/Index.vue'
import Timeline from './components/timeline/Index.vue'
import AppConnecting from '~/components/basic/AppConnecting.vue'
import { VirtualRoute, registerVirtualRouter } from '~/composables/virtual-router'
import { createCustomInspectorStateContext } from '~/composables/custom-inspector-state'

const props = defineProps<{
  id: string
}>()

const emit = defineEmits(['loadError'])
const inspectorState = createCustomInspectorStateContext()
const loading = ref(false)

const routes = computed(() => {
  return [
    {
      path: '/',
      name: 'Home',
      component: Home,
      icon: 'https://raw.githubusercontent.com/TanStack/query/main/packages/vue-query/media/vue-query.svg',
    },
    {
      path: '/state',
      name: 'State',
      component: State,
      icon: 'i-carbon-tree-view-alt',
    },
    inspectorState.value.timelineLayerIds?.length && ({
      path: '/timeline',
      name: 'Timeline',
      component: Timeline,
      icon: 'i-mdi:timeline-clock-outline',
    }),
  ].filter(Boolean) as VirtualRoute[]
})

const { VirtualRouterView, restoreRouter } = registerVirtualRouter(routes)

function getInspectorInfo() {
  loading.value = true
  onRpcConnected(() => {
    rpc.value.getInspectorInfo(props.id).then((payload) => {
      if (!payload) {
        emit('loadError')
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

watch(() => props.id, () => {
  getInspectorInfo()
}, {
  immediate: true,
})

onUnmounted(() => {
  rpc.value.unhighlight()
})
</script>

<template>
  <div h-full w-full>
    <div v-if="loading">
      <AppConnecting />
    </div>
    <VirtualRouterView v-else />
  </div>
</template>
