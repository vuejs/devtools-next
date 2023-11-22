import { join, resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import VueJSX from '@vitejs/plugin-vue-jsx'

export default {
  resolve: {
    alias: {
      '~/': `${resolve(__dirname)}/src/`,
    },
  },
  plugins: [
    {
      name: 'local-object-transform',
      transform: {
        order: 'post',
        async handler(code) {
          return `${code}\n/* Injected with object hook! */`
        },
      },
    },
    Vue(),
    VueJSX(),
    Components({
      dirs: ['./src/components'],
      dts: join(__dirname, 'components.d.ts'),
    }),
    Unocss(),
    AutoImport({
      dirs: [
        './src/utils',
        './src/composables',
        './src/constants',
      ],
      dts: join(__dirname, 'auto-imports.d.ts'),
      vueTemplate: true,
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
    }),
  ],

}
