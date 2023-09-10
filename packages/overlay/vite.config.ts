import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import fse from 'fs-extra'

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
    {
      name: 'vite-plugin-copy-devtools-overlay',
      apply: 'build',
      enforce: 'post',
      async closeBundle() {
        // rename file
        fse.renameSync(resolve(__dirname, './dist/devtools-overlay.iife.js'), resolve(__dirname, './dist/devtools-overlay.js'))

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
