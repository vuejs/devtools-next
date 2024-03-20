<script setup lang="ts">
import { ref } from 'vue'

import Home from './components/Home.vue'
import Store from './components/store/Index.vue'
import Timeline from './components/timeline/Index.vue'
import { registerVirtualRouter } from '~/composables/virtual-router'
import { createDevToolsConnectStateContext } from '~/composables/connect-state'

createDevToolsConnectStateContext()

const { VirtualRouterView } = registerVirtualRouter([
  {
    path: '/',
    component: Home,
    icon: 'i-logos-pinia',
  },
  {
    path: '/store',
    component: Store,
    icon: 'i-carbon-tree-view-alt',
  },
  {
    path: '/timeline',
    component: Timeline,
    icon: 'i-mdi:timeline-clock-outline',
  },
])

const routePath = ref('/')
</script>

<template>
  <div h-full w-full>
    <VirtualRouterView />
  </div>
</template>
