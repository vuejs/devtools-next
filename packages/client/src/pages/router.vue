<script setup lang="ts">
import { Router as RouterPanel, useCustomInspector } from '@vue/devtools-applet'
import '@vue/devtools-applet/style.css'

const { registeredInspector } = useCustomInspector()
// @ts-expect-error skip type check
const vueRouterInspector = computed(() => registeredInspector.value?.find(item => item.packageName === 'vue-router'))
// @ts-expect-error skip type check
const inspectorId = computed(() => vueRouterInspector.value?.id)
</script>

<template>
  <RouterPanel :id="inspectorId" />
</template>
