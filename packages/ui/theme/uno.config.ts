import type { UserConfig } from 'unocss'
import {
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { theme } from './theme'

export const unoConfig = {
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  theme,
  shortcuts: {
    // utilities
    '$ui-fcc': 'flex justify-center items-center',
    '$ui-fbc': 'flex justify-between items-center',
    '$ui-inline-fcc': 'inline-flex justify-center items-center',
    '$ui-z-max': 'z-2147483647',

    // general
    '$ui-bg-base': 'bg-white dark:bg-black',
    '$ui-base': 'box-border font-inherit',
    '$ui-transition': 'transition-all duration-300 ease-in-out',
    '$ui-borderless': '!border-transparent !shadow-none',
    '$ui-base-br': 'rounded-3px',
    '$ui-border-base': 'border-gray/20',
  },
  rules: [
    ['$ui-font-inherit', { 'font-family': 'inherit' }],
  ],
} as UserConfig
