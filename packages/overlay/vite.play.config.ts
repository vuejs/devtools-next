import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname)}/src/`,
      '@': resolve(__dirname, '../core/src/index'),
    },
  },
  plugins: [
    vue(),
  ],
})
