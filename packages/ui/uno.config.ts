import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'
import { theme } from './src/constants'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  theme,
  shortcuts: [
    ['base', 'box-border font-inherit'],
    ['base-br', 'rounded-3px'],
    ['inline-fcc', 'inline-flex justify-center items-center'],
    ['fcc', 'flex justify-center items-center'],
  ],
  rules: [
    ['font-inherit', { 'font-family': 'inherit' }],
  ],
})
