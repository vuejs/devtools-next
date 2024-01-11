import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/index.ts',
    'src/hook.ts',
  ],
  esbuildOptions(options) {
    if (options.format === 'esm')
      options.outExtension = { '.js': '.mjs' }
  },
  external: [
    'vue',
  ],
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
}
