<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore tsconfig
import Icon from './Icon.vue'

const props = defineProps<{
  to?: string
  icon: string
}>()
</script>

<template>
  <Component
    :is="to ? 'a' : 'button'"
    :href="to"
    v-bind="$attrs"
    class="n-transition n-icon-button"
  >
    <Icon :icon="props.icon" />
  </Component>
</template>
