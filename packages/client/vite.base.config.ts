import { join, resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'
import VueJSX from '@vitejs/plugin-vue-jsx'

export default {

  resolve: {
    alias: {
      '~/': `${resolve(__dirname)}/`,
      '@vue-devtools-next/core': resolve(__dirname, '../core/src/index'),
      '@vue-devtools-next/shared': resolve(__dirname, '../shared/src/index'),
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
    Pages({
      pagesDir: 'pages',
    }),
    Components({
      dirs: ['components'],
      dts: join(__dirname, 'components.d.ts'),
    }),
    Unocss(),
    AutoImport({
      dirs: [
        './utils',
        './composables',
      ],
      dts: join(__dirname, 'auto-imports.d.ts'),
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
    }),
  ],

}
