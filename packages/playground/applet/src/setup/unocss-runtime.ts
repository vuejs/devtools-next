// @ts-expect-error missin types
import presetIcons from '@unocss/preset-icons/browser'
import init from '@unocss/runtime'
import {
  presetAttributify,
  presetTypography,
  presetUno,
} from 'unocss'

init({
  defaults: {
    presets: [
      presetUno(),
      presetAttributify(),
      presetTypography(),
      presetIcons({
        prefix: ['i-', ''],
        collections: {},
        cdn: 'https://esm.sh/',
        scale: 1.2,
        extraProperties: {
          'display': 'inline-block',
          'vertical-align': 'middle',
        },
      }),
    ],
  },
  bypassDefined: true,
})
