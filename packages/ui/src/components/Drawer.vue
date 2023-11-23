<script setup lang="ts">
import { onKeyStroke, useVModel } from '@vueuse/core'
import { computed, onMounted, ref } from 'vue'
import type { OverlayProps } from './Overlay.vue'
import Overlay from './Overlay.vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  mountTo?: string | HTMLElement
  placement?: 'left' | 'right' | 'top' | 'bottom'
  closeOutside?: boolean
  closable?: boolean
  contentClass?: string
} & OverlayProps>(), {
  mountTo: 'body',
  placement: 'right',
  closeOutside: true,
  closable: true,
})

const emits = defineEmits<{
  'update:modelValue': [modelValue: boolean]
}>()

const show = useVModel(props, 'modelValue', emits)

const placementClasses: Record<typeof props['placement'], {
  class: string
  transition: string
}> = {
  left: {
    class: 'top-0 left-0 h-full b-r',
    transition: '[&_.drawer]:translate-x--100%',
  },
  right: {
    class: 'top-0 right-0 h-full b-l',
    transition: '[&_.drawer]:translate-x-full',
  },
  top: {
    class: 'top-0 w-full b-b',
    transition: '[&_.drawer]:translate-y--100%',
  },
  bottom: {
    class: 'bottom-0 w-full b-t',
    transition: '[&_.drawer]:translate-y-100%',
  },
}

onKeyStroke('Escape', () => {
  if (props.closable)
    show.value = false
})

const classes = computed(() => placementClasses[props.placement])

const isMount = ref(false)

onMounted(() => isMount.value = true)
</script>

<template>
  <Teleport v-if="isMount || mountTo === 'body'" :to="mountTo">
    <Transition
      :enter-from-class="`${classes.transition}`"
      :leave-to-class="`${classes.transition}`"
    >
      <Overlay v-if="show" :dim="dim" :blur="blur" @click="closeOutside && closable && (show = false)">
        <div
          :class="[classes.class, contentClass ?? '']"
          class="drawer transition-transform transition-duration-300 absolute min-w-100px $ui-border-base $ui-bg-base p2"
          @click.stop
        >
          <div v-if="closable" class="i-carbon-close text-lg right-1.5 top-1.5 absolute $ui-text cursor-pointer" @click="show = false" />
          <slot />
        </div>
      </Overlay>
    </Transition>
  </Teleport>
</template>
