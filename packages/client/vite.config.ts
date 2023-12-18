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

        // we removed `browser-extension` and `electron` when `build:lib`
        // now we need remove `vite/dist/client` when building
        ;['../vite/dist/client'].forEach((dir) => {
          fse.rmSync(resolve(__dirname, dir), { recursive: true, force: true })
        })

        ;['../browser-extension/client', '../electron/client', '../vite/dist/client'].forEach((dir) => {
          fse.copySync(clientFile, resolve(__dirname, dir))
        })
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
