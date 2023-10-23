<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import LoadingIndicator from './LoadingIndicator.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'default',
  round: 'normal',
  loading: false,
  disabled: false,
  size: 'normal',
  flat: false,
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

export interface ButtonProps {
  type?: ButtonType
  round?: 'full' | 'normal' | false
  loading?: boolean
  disabled?: boolean
  size?: 'normal' | 'mini'
  flat?: boolean
}

export type ButtonType = 'default' | 'primary' | 'accent' | 'danger' | 'warning' | 'info' | 'success'

const attrs = useAttrs()

const component = computed(() => {
  if (attrs.to)
    return 'router-link'
  else if (attrs.href)
    return 'a'
  return 'button'
})

const disabled = computed(() => props.loading || props.disabled)

function handleClick(e: MouseEvent) {
  if (disabled.value) {
    e.preventDefault()
    e.stopPropagation()
    e.stopImmediatePropagation()
    return
  }
  emit('click', e)
}

const styles: Record<'common' | 'normal' | 'flat', Record<ButtonType, string>> = {
  common: {
    default: '$ui-text active:bg-primary-100-darker dark:active:bg-gray-800-darker',
    primary: 'active:bg-primary-500-darker',
    accent: 'active:bg-accent-500-darker',
    danger: 'active:bg-danger-500-darker',
    warning: 'active:bg-warning-500-darker',
    info: 'active:bg-primary-100-darker dark:active:bg-gray-800-darker',
    success: 'active:bg-primary-100-darker dark:active:bg-gray-800-darker',
  },
  normal: {
    default: 'bg-primary-100 hover:bg-primary-100-lighter dark:(bg-gray-800 hover:bg-gray-800-lighter)',
    primary: ' text-white bg-primary-500 hover:bg-primary-500-lighter',
    accent: 'text-white bg-accent-500 hover:bg-accent-500-lighter dark:bg-accent-300',
    danger: 'text-white bg-danger-500 hover:bg-danger-500-lighter',
    warning: 'text-white bg-warning-500 hover:bg-warning-500-lighter',
    info: 'text-info-500 bg-primary-100 hover:bg-primary-100-lighter dark:(bg-gray-800 hover:bg-gray-800-lighter)',
    success: 'text-primary-500 bg-primary-100 hover:bg-primary-100-lighter dark:(bg-gray-800 hover:bg-gray-800-lighter)',
  },
  flat: {
    default: 'hover:bg-primary-100',
    primary: 'hover:(bg-primary-500 text-white)',
    accent: 'hover:(bg-accent-500 text-white)',
    danger: 'hover:(bg-danger-500 text-white)',
    warning: 'hover:(bg-warning-500 text-white)',
    info: 'hover:(bg-primary-100 text-info-500)',
    success: 'hover:(bg-primary-100 text-primary-500)',
  },
}

const slots = useSlots()
</script>

<template>
  <component
    :is="component" v-bind="$attrs"
    role="button" :aria-disabled="disabled"
    class="$ui-base select-none inline-flex no-underline
       $ui-inline-fcc border-none cursor-pointer py-0 gap5px"
    :class="[
      [styles.common[props.type]],
      {
        'rounded-full': props.round === 'full',
        '$ui-base-br': props.round === 'normal',
        'opacity-50 cursor-not-allowed': disabled,
        'bg-transparent': props.flat,
      },
      [
        size === 'mini' ? 'px4px text-12px h22px' : 'px-14px text-14px h32px',
        flat ? styles.flat[props.type] : styles.normal[props.type],
      ],
    ]"
    @click.capture="handleClick"
  >
    <LoadingIndicator v-if="loading" class="w-12px h-full mt2px" />
    <slot v-else name="icon" class="$ui-inline-fcc h-full w-12px" />
    <div v-if="slots.default">
      <slot />
    </div>
    <slot name="icon-right" />
  </component>
</template>
