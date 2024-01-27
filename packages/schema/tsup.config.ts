import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: [
    'src/index.ts',
    'src/types/index',
  ],
  external: [
    'vue',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
})
