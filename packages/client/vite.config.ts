import { resolve } from 'node:path'
import { defineConfig, mergeConfig } from 'vite'
import fse from 'fs-extra'
import baseConfig from './vite.base.config'

export default defineConfig(mergeConfig(baseConfig, {
  base: './',
  plugins: [
    {
      name: 'vite-plugin-copy-devtools-client-bundle',
      apply: 'build',
      enforce: 'post',
      closeBundle() {
        // copy
        const clientFile = resolve(__dirname, './dist')
        fse.copySync(
          clientFile,
          resolve(__dirname, '../browser-extension/client'),
        )
        fse.copySync(
          clientFile,
          resolve(__dirname, '../electron/client'),
        )
        fse.copySync(
          clientFile,
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
    minify: true, // 'esbuild',
    emptyOutDir: true,
  },
}))
