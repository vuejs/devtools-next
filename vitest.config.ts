import { defineConfig } from 'vitest/config'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [Vue()],
  define: {
    __DEV__: true,
    __FEATURE_PROD_DEVTOOLS__: true,
  },
  test: {
    globals: true,
  },
})
