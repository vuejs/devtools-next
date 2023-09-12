import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevtools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@vue-devtools-next/core': resolve(__dirname, '../core/src/index'),
      '@vue-devtools-next/shared': resolve(__dirname, '../shared/src/index'),
    },
  },
  plugins: [
    vue(),
    VueDevtools(),
  ],
})
