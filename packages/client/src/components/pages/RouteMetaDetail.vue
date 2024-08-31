<script setup lang="ts">
import { VueCodeBlock } from '@vue/devtools-ui'
import 'vanilla-jsoneditor/themes/jse-theme-dark.css'
import type { RouteMeta } from 'vue-router'

const props = defineProps<{
  meta: RouteMeta
}>()
const colorMode = useColorMode()
const meta = computed(() => props.meta)
</script>

<template>
  <div h-full select-none overflow-scroll p-2 class="no-scrollbar">
    <VueCodeBlock :code="JSON.stringify(meta, null, 2)" lang="json" lines />
  </div>
</template>
