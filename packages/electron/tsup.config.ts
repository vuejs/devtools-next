import type { Options } from 'tsup'

export default <Options>{
  entryPoints: [
    'src/client.ts',
  ],
  esbuildOptions(options) {
    if (options.format === 'iife')
      options.outExtension = { '.js': '.js' }
  },
  define: {
    'process.env': JSON.stringify(process.env),
  },
  external: [
    /^node:/,
  ],
  splitting: false,
  clean: false,
  format: ['iife'],
  dts: true,
  shims: false,
}
