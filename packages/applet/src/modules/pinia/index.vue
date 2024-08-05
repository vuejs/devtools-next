<script setup lang="ts">
import About from './components/About.vue'
import Store from './components/store/Index.vue'
import Timeline from './components/timeline/Index.vue'
import { registerVirtualRouter } from '~/composables/virtual-router'

const props = defineProps<{
  savedSelectedId?: string
}>()
const emit = defineEmits<{
  (e: 'onSelectId', id: string): void
}>()

const { VirtualRouterView } = registerVirtualRouter([
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
  {
    path: '/',
    name: 'About',
    component: About,
    icon: 'i-logos-pinia',
  },
], {
  defaultRoutePath: '/store',
})

const handleSelectId = (id: string) => {
  emit('onSelectId', id)
}
</script>

<template>
  <div h-full w-full>
    <VirtualRouterView :saved-selected-id="savedSelectedId" @on-select-id="handleSelectId" />
  </div>
</template>
