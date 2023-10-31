import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/index.ts',
    'src/server/index.ts',
  ],
  esbuildOptions(options) {
    if (options.format === 'esm')
      options.outExtension = { '.js': '.mjs' }
  },
  external: [
    'vue',
    'node:fs/promises',
    'pathe',
    'fast-glob',
  ],
  // clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
}
