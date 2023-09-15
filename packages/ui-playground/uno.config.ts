import { unoConfig } from '@vue-devtools-next/ui/theme'
import { defineConfig, mergeConfigs } from 'unocss'

export default defineConfig(mergeConfigs([unoConfig, {
  // ...
}]))
