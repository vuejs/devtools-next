<script setup lang="ts">
import Home from './components/Home.vue'
import State from './components/state/Index.vue'
import { registerVirtualRouter } from '~/composables/virtual-router'
import { createDevToolsConnectStateContext } from '~/composables/connect-state'

createDevToolsConnectStateContext()

const { VirtualRouterView } = registerVirtualRouter([
  {
    path: '/',
    name: 'Home',
    component: Home,
    icon: 'https://vee-validate.logaretm.com/v4/logo.png',
  },
  {
    path: '/state',
    name: 'State',
    component: State,
    icon: 'i-carbon-tree-view-alt',
  },
  // {
  //   path: '/timeline',
  //   name: 'Timeline',
  //   component: Timeline,
  //   icon: 'i-mdi:timeline-clock-outline',
  // },
])
</script>

<template>
  <div h-full w-full>
    <VirtualRouterView />
  </div>
</template>
