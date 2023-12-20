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

        // Removed `browser-extension` and `electron` on `build:lib`
        // Remove `vite/dist/client` on building
        ;['../vite/dist/client'].forEach((dir) => {
          const absoluteDir = resolve(__dirname, dir)
          if (fse.existsSync(absoluteDir))
            fse.removeSync(absoluteDir)
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
