<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useColorMode, useVModel } from '@vueuse/core'
import { UsePreferredColorScheme as ColorScheme } from '@vueuse/components'

const props = withDefaults(defineProps<{
  isDark?: boolean
  animation?: boolean
}>(), {
  isDark: false,
  animation: true,
})

const isDarkModel = useVModel(props, 'isDark')

const mode = useColorMode({
  initialValue: isDarkModel.value ? 'dark' : 'light',
  onChanged: (value) => {
    isDarkModel.value = value === 'dark'
  },
})

const isDark = computed({
  get: () => mode.value === 'dark',
  set: v => mode.value = v ? 'dark' : 'light',
})

// @ts-expect-error: Transition API
const isAppearanceTransition = document.startViewTransition
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
/**
 * Credit to [@hooray](https://github.com/hooray)
 * @see https://github.com/vuejs/vitepress/pull/2347
 */
function toggle(event?: MouseEvent) {
  if (!isAppearanceTransition || !event || !props.animation) {
    isDark.value = !isDark.value
    return
  }
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: isDark.value
          ? [...clipPath].reverse()
          : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}
const context = {
  mode,
  isDark,
  toggle,
}
</script>

<template>
  <ColorScheme tag="span">
    <slot v-bind="context" />
  </ColorScheme>
</template>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}
</style>
