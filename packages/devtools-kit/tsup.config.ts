import { resolve } from 'node:path'
import { defineConfig } from 'tsup'

export default defineConfig({
  entryPoints: [
    'src/index.ts',
  ],
  noExternal: ['speakingurl', 'superjson', 'vue'],
  clean: true,
  format: ['esm', 'cjs'],
  dts: true,
  shims: true,
  treeshake: 'smallest',
  define: {
    __VUE_OPTIONS_API__: 'false',
  },
  esbuildPlugins: [
    {
      // https://vuejs.org/guide/best-practices/production-deployment.html#with-build-tools
      // Replace Vue imports path to tree-shakable version
      name: 'replace-vue-import',
      setup(build) {
        const moduleMap = new Map<string, string>()

        build.onResolve({
          filter: /^vue$/,
        }, () => {
          return {
            path: resolve(__dirname, 'node_modules/vue/dist/vue.runtime.esm-bundler.js'),
          }
        })
        build.onResolve({
          filter: /^(@vue\/.*)$/,
        }, async (args) => {
          const name = args.path.replace('@vue/', '')
          let moduleFilePath: string
          if (moduleMap.has(args.path)) {
            moduleFilePath = moduleMap.get(args.path)!
          }
          else {
            moduleFilePath = `${import.meta.resolve(args.path).slice(/* file:// */7, /* /index.js */ -9)}/dist/${name}.esm-bundler.js`
            moduleMap.set(args.path, moduleFilePath)
          }
          return {
            path: moduleFilePath,
          }
        })
      },
    },
  ],
})
