<script setup lang="ts">
import JsonEditorVue from 'json-editor-vue'
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
    <JsonEditorVue
      v-model="meta" h-full class="json-editor-vue" :class="[
        colorMode === 'dark' ? 'jse-theme-dark' : '',
      ]" :main-menu-bar="false" :navigation-bar="false" :status-bar="false" :read-only="true" :indentation="2"
      :tab-size="2"
    />
  </div>
</template>
