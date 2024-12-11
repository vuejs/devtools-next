<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { nextTick } from 'vue'

const props = withDefaults(defineProps<{
  isDark?: boolean
  animation?: boolean
  animationDuration?: number
}>(), {
  isDark: false,
  animation: true,
  animationDuration: 400,
})

const isDark = useDark()
const toggleDark = useToggle(isDark)

const isAppearanceTransition = !!document.startViewTransition
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
/**
 * Credit to [@hooray](https://github.com/hooray)
 * @see https://github.com/vuejs/vitepress/pull/2347
 */
function toggle(event?: MouseEvent) {
  if (!isAppearanceTransition || !event || !props.animation) {
    toggleDark()
    return
  }
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

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
        duration: props.animationDuration,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}
</script>

<template>
  <span class="$ui-dark-toggle-vtr">
    <slot v-bind="{ isDark, toggle }" />
  </span>
</template>
