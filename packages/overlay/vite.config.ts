import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import fse from 'fs-extra'

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${resolve(__dirname)}/src/`,
      '@vue-devtools-next/core': resolve(__dirname, '../core/src/index'),
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
      fileName: () => 'devtools-overlay.js',
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
    {
      name: 'vite-plugin-copy-devtools-overlay',
      apply: 'build',
      enforce: 'post',
      async closeBundle() {
        // copy
        const overlayFile = resolve(__dirname, './dist')
        fse.copySync(
          overlayFile,
          resolve(__dirname, '../browser-extension/overlay'),
        )
        fse.copySync(
          overlayFile,
          resolve(__dirname, '../vite/src/overlay'),
        )
      },
    },
  ],
})
