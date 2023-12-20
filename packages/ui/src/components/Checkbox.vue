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
    class="relative $ui-base h5 w5 $ui-inline-fcc cursor-pointer border-0.125rem rounded-1.25 transition-colors duration-200 ease-in-out"
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
      class="h-60% w-35% transform-translate-y--0.25 transform-rotate-45 border-width-[0_0.125rem_0.125rem_0] border-white border-solid transition-opacity duration-200 ease-in-out"
    />
  </div>
</template>
