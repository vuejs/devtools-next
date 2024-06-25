<script setup lang="ts">
import { computed } from 'vue'
import { icIcons } from '../constants/ic-icons'

const props = defineProps<{
  name: string
  class?: string
}>()

const iconSvgCss = computed(() => icIcons[props.name] ?? '')
const iconSvgUrl = computed(() => `url("data:image/svg+xml;utf8,${iconSvgCss.value}")`)
</script>

<template>
  <div
    :class="[props.class]" :style="{
      background: `${iconSvgUrl} no-repeat`,
      backgroundSize: '100% 100%',
      backgroundColor: 'transparent',
      width: '1em',
      height: '1em',
    }"
  />
</template>
