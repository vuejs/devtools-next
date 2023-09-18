import { unoConfig } from '@vue-devtools-next/ui/theme'
import { defineConfig, mergeConfigs } from 'unocss'

export default defineConfig(mergeConfigs([unoConfig, {
  rules: [
    [
      /^\$ui-vtr$/,
      () => {
        console.log('hint!')
        return `
          a {
            color: 'green';
          }
        `
      },
    ],
  ],
}]))
