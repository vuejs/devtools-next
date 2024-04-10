import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/vite',
  ],
  clean: true,
  declaration: true,
  externals: [
    'vite',
    'vite-plugin-inspect',
    'vite-plugin-vue-inspector',
    'execa',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
