<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = withDefaults(defineProps<{
  modelValue: boolean
  variant?: 'normal' | 'accent'
}>(), {
  variant: 'normal',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const value = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div
    class="$ui-base relative cursor-pointer
    w20px h20px border-2px rounded-5px $ui-inline-fcc
    transition-colors duration-200 ease-in-out
    "
    :class="[
      value
        ? variant === 'normal'
          ? 'bg-primary-500 border-primary-200 dark:border-primary-100'
          : 'bg-accent-500 border-accent-200 dark:border-accent-100'
        : '',
    ]"
    @click="value = !value"
  >
    <div
      :class="[
        value ? 'opacity-100' : 'opacity-0',
      ]"
      class="w-35% h-60%
      border-solid border-width-[0_2px_2px_0] border-white transition-opacity duration-200 ease-in-out
      transform-rotate-45 transform-translate-y--1px
    "
    />
  </div>
</template>
