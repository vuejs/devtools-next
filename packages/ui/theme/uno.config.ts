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
  shortcuts: [
    ['$ui-base', 'box-border font-inherit'],
    ['$ui-base-br', 'rounded-3px'],
    ['$ui-inline-fcc', 'inline-flex justify-center items-center'],
    ['$ui-fcc', 'flex justify-center items-center'],
  ],
  rules: [
    ['$ui-font-inherit', { 'font-family': 'inherit' }],
  ],
} as UserConfig
