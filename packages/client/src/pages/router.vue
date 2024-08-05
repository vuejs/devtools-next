<script setup lang="ts">
import { Router as RouterPanel, useCustomInspector } from '@vue/devtools-applet'
import { useDefaultSelect } from '../composables/select'
import '@vue/devtools-applet/style.css'

const { registeredInspector } = useCustomInspector()
const { saveSelectedId, savedSelectedId } = useDefaultSelect()

// @ts-expect-error skip type check
const vueRouterInspector = computed(() => registeredInspector.value?.find(item => item.packageName === 'vue-router'))
// @ts-expect-error skip type check
const inspectorId = computed(() => vueRouterInspector.value?.id)
</script>

<template>
  <RouterPanel
    :id="inspectorId" :saved-selected-id="savedSelectedId"
    @on-select-id="saveSelectedId"
  />
</template>
