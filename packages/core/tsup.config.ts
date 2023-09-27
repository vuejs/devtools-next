import type { Options } from 'tsup'

export default <Options>{
  entry: {
    index: 'src/index.ts',
    vue: 'src/vue/index.ts',
  },
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
