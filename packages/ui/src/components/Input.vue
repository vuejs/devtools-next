<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: string
  type?: 'input' | 'textarea' | 'number'
  placeholder?: string
  round?: boolean
}>(), {
  type: 'input',
  placeholder: '',
  round: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'keyTab': [e: KeyboardEvent]
}>()

const focused = ref(false)

const value = useVModel(props, 'modelValue', emit)
</script>

<template>
  <div class="relative min-w-200px">
    <component
      :is="props.type === 'textarea' ? 'textarea' : 'input'"
      v-model="value" class="$ui-base w-full outline-none border-primary-100 b-1 rounded-sm"
      v-bind="$attrs" @keydown.tab.prevent="emit('keyTab', $event)"
      @focus="focused = true" @blur="focused = false"
    />
    <!-- Focus animation -->
    <div
      v-if="!round" class="bg-primary-500 absolute z-9999 bottom--1px left-0 h-2px pointer-events-none transition-all duration-240" :class="[
        focused ? 'left-0 right-0 opacity-100' : 'left-50% right-50% opacity-0',
      ]"
    />
  </div>
</template>
