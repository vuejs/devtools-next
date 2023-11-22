<script setup lang="ts">
export interface OverlayProps {
  dim?: boolean
  blur?: boolean
}

defineProps<OverlayProps>()
</script>

<template>
  <div
    class="
         $ui-z-max $ui-fcc w-full h-full absolute top-0 left-0
         transition-duration-300 transition-opacity
         $ui-bg-base absolute
        "
    :class="[
      dim ? 'bg-opacity-50!' : 'bg-opacity-0!',
      blur ? 'backdrop-blur-sm' : '',
    ]"
  >
    <slot />
  </div>
</template>
