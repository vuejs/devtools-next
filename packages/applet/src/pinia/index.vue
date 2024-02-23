<script setup lang="ts">
import { ref } from 'vue'

import Timeline from './components/timeline/Index.vue'
import Home from './components/Home.vue'
import { registerVirtualRouter } from '~/composables/virtual-router'

const { VirtualRouterView } = registerVirtualRouter([{
  path: '/',
  component: Home,
}, {
  path: '/timeline',
  component: Timeline,
}])

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
