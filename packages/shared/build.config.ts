import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    'src/index',
  ],
  externals: [
  ],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
})
