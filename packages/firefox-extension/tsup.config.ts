import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: [
    'src/*.ts',
  ],
  esbuildOptions(options) {
    if (options.format === 'iife')
      options.outExtension = { '.js': '.js' }
  },
  define: {
    'process.env': JSON.stringify(process.env),
    '__VUE_OPTIONS_API__': 'true',
    '__VUE_PROD_DEVTOOLS__': 'true',
  },
  clean: true,
  format: ['iife'],
  minify: true,
})
