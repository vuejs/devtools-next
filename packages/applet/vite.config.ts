import { join, resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import fse from 'fs-extra'

const argv = process.argv.slice(2)
const enableWatch = argv.includes('--watch')

export default {
  resolve: {
    alias: {
      '~/': `${resolve(__dirname)}/src/`,
    },
  },
  plugins: [
    Unocss(),
    Vue(),
    {
      name: 'move-dts',
      apply: 'build',
      enforce: 'post',
      closeBundle() {
        // copy
        const targetDir = resolve(__dirname, './dist')

        fse.copySync('./index.d.ts', join(targetDir, './index.d.ts'))
      },
    },
  ],
  build: {
    emptyOutDir: !enableWatch,
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'devtoolsApplet',
      fileName: ext => `index.${ext === 'es' ? 'js' : ext}`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        assetFileNames: 'index.[ext]',
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
}
