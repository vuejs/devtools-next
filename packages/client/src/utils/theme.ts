export const ThemeStorageKeys = {
  default: 'vueuse-color-scheme',
  vitepress: 'vitepress-theme-appearance',
}

export function getThemeKey() {
  let themeKey = ThemeStorageKeys.default

  const nonDefaultKeys = Object
    .values(ThemeStorageKeys)
    .filter(key => key !== ThemeStorageKeys.default)

  const resultKey = nonDefaultKeys.find(key => useLocalStorage(key, undefined).value)

  if (resultKey)
    themeKey = resultKey

  return themeKey
}
