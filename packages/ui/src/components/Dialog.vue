<script setup lang="ts">
import { onKeyStroke, useScrollLock, useVModel } from '@vueuse/core'
import { watchEffect } from 'vue'
import Button from './Button.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    dim?: boolean
    blur?: boolean
    autoClose?: boolean
    title?: string
    width: string
    height: string
  }>(),
  {
    title: 'Dialog',
    modelValue: false,
    dim: true,
    blur: true,
    autoClose: true,
    width: '500px',
    height: '300px',
  },
)

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'update:modelValue', value: boolean): void
}>()

const show = useVModel(props, 'modelValue', emit, { passive: true })

const isScrollLocked = useScrollLock(() => window.document.documentElement)
watchEffect(() => {
  if (show.value)
    isScrollLocked.value = true
  else
    isScrollLocked.value = false
})

function close() {
  if (show.value && props.autoClose)
    show.value = false
}

onKeyStroke('Escape', () => {
  close()
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-from-class="opacity-0 [&_.modal]:scale-95 [&_.content,&_.footer]:translate-y--10px [&_.content,&_.footer]:opacity-0"
      enter-to-class="opacity-100 [&_.modal]:scale-100"
      leave-from-class="opacity-100 [&_.modal]:scale-100"
      leave-to-class="opacity-0 [&_.modal]:scale-95"
    >
      <div
        v-if="show" class="
         $ui-z-max $ui-fcc w-100vw h-100vh absolute top-0 left-0
         transition-duration-300 transition-opacity
         $ui-bg-base absolute
        "
        :class="[
          dim ? 'bg-opacity-50' : 'bg-opacity-0',
          blur ? 'backdrop-blur-sm' : '',
        ]"
      >
        <div
          class="modal rounded-sm relative $ui-bg-base dark:(color-gray-200) color-gray-800
        shadow-2xl transition-duration-300 transition-transform
          max-w-[calc(100vw-100px)] max-h-[calc(100vh-100x)]
          min-w-200px min-h-100px px24px py18px $ui-base
          grid grid-rows-[30px_1fr_40px] gap-10px
        "
          :style="{
            width: props.width,
            height: props.height,
          }"
        >
          <div class="w-full h-30px $ui-fbc">
            <div class="text-18px">
              <slot name="title">
                {{ props.title }}
              </slot>
            </div>
            <div class="transition-colors w6 h6 rounded-full cursor-pointer $ui-fcc hover:bg-primary-100 dark:hover:bg-gray-800" @click="close">
              <div class="i-carbon-close" />
            </div>
          </div>
          <div class="content transition-all transition-duration-300">
            <slot />
          </div>
          <div class="w-full h32px footer delay-250 transition-all transition-duration-300">
            <slot name="footer">
              <div class="$ui-fcc">
                <Button type="primary" @click="close">
                  close
                </Button>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
