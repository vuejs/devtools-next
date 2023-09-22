import { defineConfig, mergeConfigs, presetAttributify } from 'unocss'
import { unoConfig } from '../ui/theme/index'

export default defineConfig(mergeConfigs([unoConfig, {
  shortcuts: {
    'bg-base': 'bg-white dark:bg-black',
  },
  presets: [
    presetAttributify(),
  ],
}]))
