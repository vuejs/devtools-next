<script setup lang="ts">
const props = withDefaults(defineProps<{
  icon?: string
  title?: string
  showTitle?: boolean
  fallback?: string
}>(), {
  showTitle: true,
})

const _icon = ref<string | undefined>(props.icon)

function onLoadError() {
  _icon.value = props.fallback
}
</script>

<template>
  <img
    v-if="_icon && (_icon.startsWith('/') || _icon.match(/^https?:/))"
    :style="{
      width: '1em',
      height: '1em',
    }"
    v-bind="$attrs"
    :src="_icon"
    :alt="title"
    @error="onLoadError"
  >
  <div
    v-else
    :style="{
      width: '1em',
      height: '1em',
    }"
    v-bind="$attrs"
    :class="_icon || 'i-carbon-bring-forward'"
    :title="showTitle ? title : undefined"
  />
</template>
