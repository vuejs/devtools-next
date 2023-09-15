import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/*.ts',
  ],
  esbuildOptions(options) {
    if (options.format === 'iife')
      options.outExtension = { '.js': '.js' }
  },
  define: {
    'process.env': JSON.stringify(process.env),
  },
  clean: true,
  format: ['iife'],
  dts: true,
  shims: true,
}
