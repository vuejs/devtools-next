import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  externals: [
    'vue',
  ],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
