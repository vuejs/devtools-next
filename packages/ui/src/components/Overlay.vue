<script setup lang="ts">
export interface OverlayProps {
  dim?: boolean
  blur?: boolean
}

defineProps<OverlayProps>()
</script>

<template>
  <div
    class="absolute absolute left-0 top-0 $ui-z-max h-full w-full $ui-fcc transition-opacity transition-duration-300 $ui-bg-base"
    :class="[
      dim ? 'bg-opacity-50!' : 'bg-opacity-0!',
      blur ? 'backdrop-blur-sm' : '',
    ]"
  >
    <slot />
  </div>
</template>
