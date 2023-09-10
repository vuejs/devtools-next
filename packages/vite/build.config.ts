import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/vite',
  ],
  clean: false,
  declaration: true,
  externals: [
    'vite',
    'vite-plugin-inspect',
    'vite-plugin-vue-inspector',
    'execa',
    '@webfansplz/vuedoc-parser',
  ],
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
})
