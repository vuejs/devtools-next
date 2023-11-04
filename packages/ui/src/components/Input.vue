<script setup lang="ts">
import { refDebounced, refWithControl, useVModel } from '@vueuse/core'
import { computed, nextTick, onMounted, ref, watchEffect } from 'vue'
import VueIcon from './Icon.vue'
import VueLoading from './LoadingIndicator.vue'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  variant?: 'normal' | 'accent' | 'flat' | 'warning'
  disabled?: boolean
  password?: boolean
  leftIcon?: string
  rightIcon?: string
  loading?: boolean
  autoFocus?: boolean
  loadingDebounceTime?: number
}>(), {
  placeholder: '',
  variant: 'normal',
  disabled: false,
  password: false,
  /**
   * loading will auto enable disabled
   */
  loading: false,
  autoFocus: false,
  loadingDebounceTime: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'updateFocused': [value: boolean]
  'keyTab': [e: KeyboardEvent]
}>()

const value = useVModel(props, 'modelValue', emit)
const loading = refDebounced(computed(() => props.loading), props.loadingDebounceTime)

const focused = refWithControl(false, {
  onChanged(value) {
    emit('updateFocused', value)
  },
})
const noFocusAnimation = computed(() => props.variant === 'flat' || props.variant === 'warning')

const disabled = computed(() => props.disabled || loading.value)

const inputRef = ref<HTMLInputElement>()

const iconClasses = 'transition-colors $ui-fcc color-gray-500 dark:color-gray-300 group-[&.focused]:color-primary-500; group-[&.accent.focused]:color-accent-500'

let focusedOnLoading = false
watchEffect(() => {
  if (loading.value && focused.value) {
    focusedOnLoading = true
  }
  else if (!loading.value && focusedOnLoading) {
    focusedOnLoading = false
    nextTick(() => {
      focused.value = true
    })
  }
})

onMounted(() => {
  if (props.autoFocus)
    focused.value = true
})

watchEffect(() => {
  if (focused.value)
    inputRef.value?.focus()
})
</script>

<template>
  <div
    class="relative w-auto w-200px overflow-hidden b-1 rounded-1
           flex justify-between items-center gap-2px py-3px px12px color-gray-800 dark:color-gray-100 group"
    :class="[
      {
        'border-none bg-transparent group': variant === 'flat',
        'cursor-not-allowed opacity-50': disabled,
        'accent': variant === 'accent',
        'focused': focused,
      },
      [
        variant === 'warning'
          ? 'border-warning-500 dark:border-warning-300'
          : 'border-primary-100 dark:border-gray-700',
      ],
    ]"
    @click="() => {
      focused = true
    }"
  >
    <div v-if="leftIcon" :class="iconClasses">
      <VueIcon :icon="leftIcon" />
    </div>
    <input
      ref="inputRef" v-model="value"
      class="$ui-base w-full outline-none bg-transparent color-inherit
        placeholder-color-gray-500 dark:placeholder-gray-300" :type="props.password ? 'password' : 'text'"
      :placeholder="placeholder" :disabled="disabled"
      @blur="focused = false"
    >
    <div v-if="loading" :class="iconClasses">
      <VueLoading />
    </div>
    <div v-else-if="rightIcon" :class="iconClasses">
      <VueIcon :icon="rightIcon" />
    </div>
    <!-- Focus animation -->
    <div
      v-if="!noFocusAnimation" class="absolute z-9999 bottom--1px bg-primary-500
           h-3px pointer-events-none transition-all duration-240
           left-50% right-50% opacity-0
           group-[&.focused]:(left-0 right-0 opacity-100)
           group-[&.accent.focused]:bg-accent-500
      "
    />
  </div>
</template>
