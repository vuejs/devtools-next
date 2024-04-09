import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: [
    'src/vite.ts',
  ],
  // To avoid esbuild compile import.meta.url to import_meta.url
  // See: https://github.com/vitejs/vite/issues/503
  target: 'es2020',
  clean: true,
  format: ['esm', 'cjs'],
  // See: https://github.com/evanw/esbuild/issues/1921
  inject: ['./esbuild-shims/cjs-shim.ts'],
  dts: true,
  shims: true,
})
