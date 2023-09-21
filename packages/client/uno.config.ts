import { unoConfig } from '@vue-devtools-next/ui/theme'
import { defineConfig, mergeConfigs, presetAttributify } from 'unocss'

export default defineConfig(mergeConfigs([unoConfig, {
  shortcuts: {
    'bg-base': 'bg-white dark:bg-black',
  },
  presets: [
    presetAttributify(),
  ],
}]))
