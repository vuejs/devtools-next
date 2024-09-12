<script setup lang="ts">
import { onRpcConnected, rpc } from '@vue/devtools-core'
import { computed, provide, ref } from 'vue'
import { registerVirtualRouter, VirtualRoute } from '~/composables/virtual-router'
import About from './components/About.vue'
import Settings from './components/Settings.vue'
import Store from './components/store/Index.vue'
import Timeline from './components/timeline/Index.vue'

const pluginSettings = ref(null)
provide('pluginSettings', pluginSettings)

const routes = computed(() => {
  return [
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
    pluginSettings.value && ({
      path: '/settings',
      name: 'Settings',
      component: Settings,
      icon: 'i-mdi:cog-outline',
    }),
  ].filter(Boolean) as VirtualRoute[]
})

const { VirtualRouterView, restoreRouter } = registerVirtualRouter(routes, {
  defaultRoutePath: '/store',
})

onRpcConnected(() => {
  const pluginDescriptorId = 'dev.esm.pinia'
  rpc.value.getPluginSettings(pluginDescriptorId).then((settings) => {
    if (settings.options) {
      pluginSettings.value = settings
    }
    else {
      pluginSettings.value = null
    }
  })
})
</script>

<template>
  <div h-full w-full>
    <VirtualRouterView />
  </div>
</template>
