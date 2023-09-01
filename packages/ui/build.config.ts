import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/resolver',
    'src/unocss',
    { input: 'src/components/', outDir: 'dist/components' },
  ],
  externals: [
    'unplugin-vue-components',
  ],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
