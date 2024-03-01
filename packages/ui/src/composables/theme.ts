import { BasicColorMode, UseColorModeOptions, useColorMode, useLocalStorage } from '@vueuse/core'

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
    options.storageKey = keys.find(k => !!useLocalStorage(k, undefined).value)
  }

  const colorMode = useColorMode(options)

  return colorMode
}
