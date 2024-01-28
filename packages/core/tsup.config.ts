import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: [
    'src/index.ts',
    'src/server/index.ts',
  ],
  external: [
    'vue',
    'node:fs/promises',
    'pathe',
    'fast-glob',
    'vite-plugin-inspect',
  ],
  // clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
})
