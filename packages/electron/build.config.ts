import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/cli', 'src/app'],
  clean: false,
  declaration: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
  },
  failOnWarn: false,
})
