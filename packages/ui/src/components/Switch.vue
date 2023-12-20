<script setup lang="ts">
import { useToggle, useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const value = useVModel(props, 'modelValue', emit)
const toggleValue = useToggle(value)
</script>

<template>
  <div
    :class="[
      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    ]"
    class="$ui-base $ui-if-sc cursor-pointer select-none gap1.25 vertical-mid text-3.5" role="checkbox" @click="!disabled && toggleValue()"
  >
    <slot />
    <div
      :class="{
        selected: value,
      }"
      class="group relative $ui-base h4 w8 rounded-2 bg-primary-100 transition-colors dark:bg-gray-700 [&.selected]:bg-primary-500!"
    >
      <div
        class="h4 w4 rounded-full bg-primary-800 transition-transform group-[&.selected]:transform-translate-x-4 dark:bg-white"
        :class="[
          { 'group-hover:opacity-75 group-active:scale-85': !disabled },
          { 'opacity-65': disabled },
        ]"
      />
    </div>
  </div>
</template>
