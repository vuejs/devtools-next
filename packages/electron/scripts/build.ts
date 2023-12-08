import { resolve as _resolve } from 'node:path'
import type { Options } from 'tsup'
import { build } from 'tsup'
import { build as unbuild } from 'unbuild'

const argv = process.argv.slice(2)
const enableWatch = argv.includes('--watch')

const baseOptions = {
  dts: true,
  format: ['cjs', 'esm'],
  esbuildOptions(options) {
    if (options.format === 'esm')
      options.outExtension = { '.js': '.mjs' }
    else if (options.format === 'iife')
      options.outExtension = { '.js': '.js' }
  },
  watch: enableWatch,
  splitting: false,
  clean: false,
} satisfies Options

function resolve(path: string) {
  return _resolve(path)
}

async function buildBundle() {
  unbuild('', enableWatch, {
    declaration: true,
    clean: false,
    entries: [
      'src/cli',
    ],
    rollup: {
      emitCJS: true,
      inlineDependencies: true,
    },
    failOnWarn: false,
  })

  build({
    entry: [resolve('./src/user-app.ts')],
    ...baseOptions,
    format: ['cjs', 'esm', 'iife'],
    clean: false,
  })

  build({
    entry: [resolve('./src/index.ts'), resolve('./src/app.ts')],
    ...baseOptions,
    external: ['./user-app.mjs', './user-app.js'],
    clean: false,
  })

  build({
    entry: [resolve('./src/devtools.ts')],
    ...baseOptions,
    format: ['iife'],
  })
}

buildBundle()
