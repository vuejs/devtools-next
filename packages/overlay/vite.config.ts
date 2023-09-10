import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname)}/src/`,
    },
  },
  define: {
    'process.env': process.env,
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'devtoolsOverlay',
      fileName: 'devtools-overlay',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        assetFileNames: 'devtools-overlay.[ext]',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  plugins: [
    vue(),
  ],
})
