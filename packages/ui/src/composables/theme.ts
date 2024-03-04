import { BasicColorMode, UseColorModeOptions, useColorMode } from '@vueuse/core'

/**
 * priorites following the desc order
 */
export const ThemeStroageKeys = {
  vitepress: 'vitepress-theme-appearance',
  default: 'vueuse-color-scheme',
}

export function useTheme<T extends string = BasicColorMode>(options?: UseColorModeOptions<T>) {
  options = options || {}

  if (!options?.storageKey) {
    const keys = Object.values(ThemeStroageKeys)
    options.storageKey = keys.find(k => !!localStorage.getItem(k))
  }

  const colorMode = useColorMode(options)

  return colorMode
}
