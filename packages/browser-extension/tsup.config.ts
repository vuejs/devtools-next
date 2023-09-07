import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/*.ts',
  ],
  esbuildOptions(options) {
    if (options.format === 'iife')
      options.outExtension = { '.js': '.js' }
  },
  clean: true,
  format: ['iife'],
  dts: true,
  shims: true,
}
