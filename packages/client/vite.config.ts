import { resolve } from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import fse from 'fs-extra'
import baseConfig from './vite.base.config'

export default defineConfig(mergeConfig(baseConfig, {
  base: './',
  plugins: [
    {
      name: 'vite-plugin-copy-devtools-overlay',
      apply: 'build',
      enforce: 'post',
      async closeBundle() {
        // copy
        const overlayFile = resolve(__dirname, './dist')
        fse.copySync(
          overlayFile,
          resolve(__dirname, '../browser-extension/client'),
        )
        fse.copySync(
          overlayFile,
          resolve(__dirname, '../vite/dist/client'),
        )
      },
    },
  ],
  optimizeDeps: {
    exclude: [
      'vite-hot-client',
    ],
  },
  build: {
    target: 'esnext',
    minify: false, // 'esbuild',
    emptyOutDir: true,
  },
}))
