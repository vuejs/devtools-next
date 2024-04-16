import { type UseColorModeOptions, useColorMode } from '@vueuse/core'
import { computed } from 'vue'
import { THEME_KEY } from './constants'

export function useDevtoolsColorMode(options: Omit<UseColorModeOptions, 'storageKey'> = {}) {
  const colorMode = useColorMode({
    ...options,
    storageKey: THEME_KEY,
  })
  return {
    colorMode,
    isDark: computed(() => colorMode.value === 'dark'),
  }
}
