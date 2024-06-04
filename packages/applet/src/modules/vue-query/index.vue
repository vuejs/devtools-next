<script setup lang="ts">
import Home from './components/Home.vue'
import State from './components/state/index.vue'
import Timeline from './components/timeline/Index.vue'
import { registerVirtualRouter } from '~/composables/virtual-router'

const { VirtualRouterView } = registerVirtualRouter([
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
