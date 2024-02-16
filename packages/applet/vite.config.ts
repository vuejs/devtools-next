import { resolve } from 'node:path'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'

export default {
  resolve: {
    alias: {
      '~/': `${resolve(__dirname)}/src/`,
    },
  },
  plugins: [
    Unocss(),
    Vue(),
  ],
  build: {
    emptyOutDir: true,
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
