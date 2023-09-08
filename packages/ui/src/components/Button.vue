<script setup lang="ts">
defineProps<{
  to?: string
  icon?: string
}>()
</script>

<template>
  <Component
    :is="to ? 'a' : 'button'"
    :href="to"
    v-bind="$attrs"
    class="n-button-base active:n-button-active focus-visible:n-focus-base n-transition hover:n-button-hover n-disabled:n-disabled"
  >
    <slot name="icon">
      <div v-if="icon" class="n-icon n-button-icon" :class="icon" />
    </slot>
    <slot />
  </Component>
</template>
