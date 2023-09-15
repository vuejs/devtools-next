/// <reference types="histoire" />

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { HstVue } from '@histoire/plugin-vue'
import unocss from 'unocss/vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    unocss(),
    dts({
      cleanVueFileName: true,
      include: ['src/**/*.{vue,ts}'],
      outDir: 'dist/types',
    }),
  ],
  build: {
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
    lib: {
      entry: 'src/index.ts',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
  },
  histoire: {
    setupCode: [
      'import "uno.css"',
    ],
    theme: {
      title: 'Vue-Devtools-Next-UI',
    },
    defaultStoryProps: {
      layout: {
        type: 'grid',
        width: 320,
      },
      responsiveDisabled: true,
      autoPropsDisabled: true,
    },
    plugins: [
      HstVue(),
    ],
  },
})
