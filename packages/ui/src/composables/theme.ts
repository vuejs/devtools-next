import { BasicColorMode, UseColorModeOptions, useColorMode } from '@vueuse/core'
import { THEME_STORAGE_KEYS, checkIsVitepress } from '@vue/devtools-shared'

export function useTheme<T extends string = BasicColorMode>(options?: UseColorModeOptions<T>) {
  options = options || {}

  if (!options?.storageKey) {
    if (checkIsVitepress())
      options.storageKey = THEME_STORAGE_KEYS.vitepress
  }

  const colorMode = useColorMode(options)

  return colorMode
}
