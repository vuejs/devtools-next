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
  },
  {
    path: '/store',
    component: Store,
  },
  {
    path: '/timeline',
    component: Timeline,
  },
])

const routePath = ref('/')

function toggleRoute(route: string) {
  routePath.value = route
}
</script>

<template>
  <div h-full w-full>
    <VirtualRouterView />
  </div>
</template>
