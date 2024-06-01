<script setup lang="ts">
import Home from './components/Home.vue'
import Routes from './components/routes/Index.vue'
import Timeline from './components/timeline/Index.vue'
import { registerVirtualRouter } from '~/composables/virtual-router'

const { VirtualRouterView } = registerVirtualRouter([
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
</script>

<template>
  <div h-full w-full>
    <VirtualRouterView />
  </div>
</template>
