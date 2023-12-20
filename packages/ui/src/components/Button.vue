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
  outlined: false,
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
  outlined?: boolean
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

const styles: Record<'common' | 'normal' | 'flat' | 'outlined', Record<ButtonType, string>> = {
  common: {
    default: 'active:bg-primary-100-darker dark:active:bg-gray-800-darker',
    primary: 'active:bg-primary-500-darker',
    accent: 'active:bg-accent-500-darker',
    danger: 'active:bg-danger-500-darker',
    warning: 'active:bg-warning-500-darker',
    info: 'active:bg-primary-100-darker dark:active:bg-gray-800-darker',
    success: 'active:bg-primary-100-darker dark:active:bg-gray-800-darker',
  },
  normal: {
    default: 'bg-primary-100 hover:bg-primary-100-lighter dark:(bg-gray-800 hover:(bg-gray-800-lighter text-white))',
    primary: ' text-white bg-primary-500 hover:bg-primary-500-lighter dark:hover:bg-primary-500-darker',
    accent: 'text-white bg-accent-500 hover:bg-accent-500-lighter dark:bg-accent-500-darker dark:bg-accent-300',
    danger: 'text-white bg-danger-500 hover:bg-danger-500-lighter dark:hover:bg-danger-500-darker',
    warning: 'text-white bg-warning-500 hover:bg-warning-500-lighter dark:hover:bg-warning-500-darker',
    info: 'text-info-500 bg-primary-100 hover:bg-primary-100-lighter dark:(bg-gray-800 hover:bg-gray-800-lighter)',
    success: 'text-primary-500 bg-primary-100 hover:bg-primary-100-lighter dark:(bg-gray-800 hover:bg-gray-800-lighter)',
  },
  flat: {
    default: 'hover:(bg-primary-100 text-black) dark:(!text-white hover:(bg-primary-800))',
    primary: 'hover:(bg-primary-500 text-white)',
    accent: 'hover:(bg-accent-500 text-white)',
    danger: 'hover:(bg-danger-500 text-white)',
    warning: 'hover:(bg-warning-500 text-white)',
    info: 'hover:(bg-primary-100 text-info-500) dark:(hover:(bg-gray-800 text-info-400))',
    success: 'hover:(bg-primary-100 text-primary-500) dark:(hover:(bg-primary-800 text-primary-400))',
  },
  outlined: {
    default: 'hover:(border-primary-100 text-primary-300 active:(ring-primary-100:5 bg-primary-100:5))',
    primary: 'hover:(border-primary-500 text-primary-500) active:(ring-primary-500:5 bg-primary-500:5)',
    accent: 'hover:(border-accent-500 text-accent-500) active:(ring-accent-500:5 bg-accent-500:5)',
    danger: 'hover:(border-danger-500 text-danger-500) active:(ring-danger-500:5 bg-danger-500:5)',
    warning: 'hover:(border-warning-500 text-warning-500) active:(ring-warning-500:5 bg-warning-500:5)',
    info: 'hover:(border-info-500 text-info-500) active:(ring-info-500:5 bg-info-500:5)',
    success: 'hover:(border-primary-500 text-primary-500) active:(ring-primary-500:5 bg-primary-500:5)',
  },
}

const slots = useSlots()

const variantClasses = computed(() => {
  if (props.flat)
    return styles.flat[props.type]
  if (props.outlined)
    return styles.outlined[props.type]
  return styles.normal[props.type]
})
</script>

<template>
  <component
    :is="component" v-bind="$attrs"
    role="button" :aria-disabled="disabled"
    class="$ui-base $ui-inline-fcc inline-flex cursor-pointer select-none gap1.25 py-0 no-underline $ui-transition"
    :class="[
      [styles.common[props.type]],
      {
        'rounded-full': props.round === 'full',
        '$ui-base-br': props.round === 'normal',
        'opacity-50 cursor-not-allowed': disabled,
        'bg-transparent': props.flat || props.outlined,
      },
      [
        outlined ? 'b-1 $ui-border-base active:ring-3 shadow-sm' : 'border-none',
        size === 'mini' ? 'px1 text-3 h5.5' : 'px3.5 text-3.5 h8',
        variantClasses,
      ],
    ]"
    @click.capture="handleClick"
  >
    <LoadingIndicator v-if="loading" class="mt0.5 h-full w3" />
    <slot v-else name="icon" class="h-full w3 $ui-inline-fcc" />
    <div v-if="slots.default">
      <slot />
    </div>
    <slot name="icon-right" />
  </component>
</template>
