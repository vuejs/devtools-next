<script setup lang="ts">
import Home from './components/Home.vue'
import Store from './components/store/Index.vue'
import Timeline from './components/timeline/Index.vue'
import { registerVirtualRouter } from '~/composables/virtual-router'

const { VirtualRouterView } = registerVirtualRouter([
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'i-logos-pinia',
  },
  {
    path: '/store',
    name: 'Store',
    component: Store,
    icon: 'i-carbon-tree-view-alt',
  },
  {
    path: '/timeline',
    name: 'Timeline',
    component: Timeline,
    icon: 'i-mdi:timeline-clock-outline',
  },
], {
  defaultRoutePath: '/store',
})
</script>

<template>
  <div h-full w-full>
    <VirtualRouterView />
  </div>
</template>
