<script setup lang="ts">
import { useToggle, useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const value = useVModel(props, 'modelValue', emit)
const toggleValue = useToggle(value)
</script>

<template>
  <div
    class="checkbox" :class="{
      selected: value,
    }" role="checkbox" @click="toggleValue()"
  >
    <div>
      <slot />
    </div>
    <div class="wrapper group">
      <div class="switcher group-hover:opacity-75 group-active:scale-85" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.checkbox {
  @apply inline-block vertical-mid select-none text-14px $ui-base cursor-pointer $ui-fsc gap5px;
  .wrapper {
    @apply $ui-base w32px h16px rounded-8px transition-colors relative bg-primary-100 dark:bg-gray-700;
    .switcher {
      @apply w16px h16px rounded-full transition-transform bg-primary-800 dark:bg-white
    }
  }
  &.selected {
    .wrapper {
      @apply bg-primary-500;
      .switcher {
        @apply transform-translate-x-16px;
      }
    }
  }
}
</style>
