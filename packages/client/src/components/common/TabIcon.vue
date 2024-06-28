<script setup lang="ts">
import { isUrlString } from '@vue/devtools-shared'
import { VueIcIcon } from '@vue/devtools-ui'

const props = withDefaults(defineProps<{
  icon?: string
  title?: string
  showTitle?: boolean
  fallback?: string
}>(), {
  showTitle: true,
})

const _icon = ref<string | undefined>(props.icon)

watch(() => props.icon, (icon) => {
  _icon.value = icon
})

function onLoadError() {
  _icon.value = props.fallback
}

// For custom-inspector icons, the prefix is 'custom-ic-'
const CUSTOM_IC_ICON_PREFIX = 'custom-ic-'
</script>

<template>
  <img
    v-if="_icon && isUrlString(_icon)"
    :style="{
      width: '1em',
      height: '1em',
    }"
    v-bind="$attrs"
    :src="_icon"
    :alt="title"
    @error="onLoadError"
  >
  <VueIcIcon
    v-else-if="_icon?.startsWith(CUSTOM_IC_ICON_PREFIX)" :name="_icon.slice(CUSTOM_IC_ICON_PREFIX.length)"
    v-bind="$attrs" :title="showTitle ? title : undefined"
  />
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
