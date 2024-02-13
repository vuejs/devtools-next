import { defineConfig } from 'tsup'
import Vue from 'unplugin-vue/esbuild'

export default defineConfig({
  entryPoints: [
    'src/index.ts',
  ],
  minify: true,
  clean: true,
  dts: false,
  external: ['vue'],
  format: ['cjs', 'esm'],
  shims: true,
  esbuildPlugins: [
    Vue(),
  ],
})
