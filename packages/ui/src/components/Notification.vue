<script setup lang="ts">
import { ref } from 'vue'
import { type VueNotificationPosition, provideNotificationFn } from '../composables/notification'
import type { VueNotificationOptions } from '../composables'

type NotificationType = NonNullable<VueNotificationOptions['type']>

const show = ref(false)
const icon = ref<string>()
const text = ref<string>()
const classes = ref<string>()
const position = ref<VueNotificationPosition>('top-center')

const icons: Record<NotificationType, string> = {
  success: 'i-carbon-checkmark',
  info: 'i-carbon-information',
  warning: 'i-carbon-warning',
  error: 'i-carbon-close',
}

const typeClasses: Record<NotificationType, string> = {
  success: 'text-primary-500 border-primary-200',
  info: 'text-blue-4 border-blue-2',
  warning: 'text-amber-4 border-amber-2',
  error: 'text-red-4 border-red-2',
}

provideNotificationFn((data) => {
  text.value = data.message
  const type = data.type ?? 'info'
  icon.value = icons[type]
  classes.value = `${typeClasses[type]} ${data.classes ?? ''}`
  show.value = true
  position.value = data.position ?? 'top-center'
  setTimeout(() => {
    show.value = false
  }, data.duration ?? 1500)
})
</script>

<template>
  <div
    class="fixed left-0 right-0 z-999 text-center"
    :class="[
      { 'pointer-events-none overflow-hidden': !show },
      { 'top-0': position.startsWith('top') },
      { 'bottom-0': position.startsWith('bottom') },
    ]"
  >
    <div class="flex" :style="{ justifyContent: position.includes('right') ? 'right' : position.includes('left') ? 'left' : 'center' }">
      <div
        class="$ui-bg-base m3 flex-inline items-center gap2 b-1 border-base rounded px4 py1 transition-all duration-300"
        :style="show ? {} : { transform: `translateY(${position.startsWith('top') ? '-' : ''}300%)` }"
        :class="[show ? 'shadow' : 'shadow-none', classes]"
      >
        <div v-if="icon" :class="icon" />
        <div>{{ text }}</div>
      </div>
    </div>
  </div>
</template>
