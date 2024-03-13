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
  leftIcon?: string
  rightIcon?: string
  loading?: boolean
  autoFocus?: boolean
  loadingDebounceTime?: number
  readonly?: boolean
  type?: string
}>(), {
  placeholder: '',
  variant: 'normal',
  disabled: false,
  type: 'text',
  /**
   * loading will auto enable disabled
   */
  loading: false,
  autoFocus: false,
  loadingDebounceTime: 0,
  readonly: false,
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
const noFocusAnimation = computed(() => props.variant === 'flat' || props.variant === 'warning' || props.disabled || props.readonly)

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
    class="group relative w-50 w-auto flex items-center justify-between gap-0.5 overflow-hidden b-1 rounded-1 px3 py-0.75 color-gray-800 dark:color-gray-100"
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
      class="$ui-base w-full bg-transparent color-inherit outline-none placeholder-color-gray-500 dark:placeholder-gray-300" :type="type"
      :placeholder="placeholder" :disabled="disabled || readonly"
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
      v-if="!noFocusAnimation" class="pointer-events-none absolute bottom--0.25 left-50% right-50% z-9999 h-0.75 bg-primary-500 opacity-0 transition-all duration-240 group-[&.focused]:(left-0 right-0 opacity-100) group-[&.accent.focused]:bg-accent-500"
    />
  </div>
</template>
