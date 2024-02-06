import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import VueDevtools from 'vite-plugin-vue-devtools'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevtools(),
    Unocss(),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        '@vueuse/core',
      ],
    }),
  ],
  server: {
    port: 3000,
  },
})
