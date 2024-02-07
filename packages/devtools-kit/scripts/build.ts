import { Options, build as tsup } from 'tsup'
import Vue from 'unplugin-vue/esbuild'
import { execaCommandSync } from 'execa'
import fse from 'fs-extra'

const argv = process.argv.slice(2)
const watch = argv.includes('--watch')
const dtsOnly = argv.includes('--dts-only')
const baseOptions = {
  entryPoints: [
    'src/index.ts',
  ],
  external: [
    'vue',
  ],
  noExternal: ['speakingurl'],
  shims: true,
  format: ['esm', 'cjs'],
} satisfies Options

function buildAppletTypes() {
  try {
    execaCommandSync(`vue-tsc --declaration --emitDeclarationOnly -p ./tsconfig.applet.json`)
  }
  catch (error) {
    // @ts-expect-error expected
    console.error(`ERROR: generate types failed. stdout:${error.stdout}`)
  }
}

async function buildKitTypes() {
  await tsup({
    ...baseOptions,
    dts: {
      only: true,
    },
  })
}

export async function build() {
  fse.removeSync('./dist')
  await Promise.all([
    tsup({
      ...baseOptions,
      watch,
      clean: false,
      dts: true,
    }),
    tsup({
      entryPoints: ['src/applet.ts'],
      minify: true,
      clean: false,
      dts: false,
      loader: {},
      watch,
      external: ['vue'],
      esbuildPlugins: [
        Vue(),
      ],
    }),
  ])
  !watch && buildAppletTypes()
}

async function buildTypes() {
  await buildKitTypes()
  buildAppletTypes()
}

dtsOnly ? buildTypes() : build()
