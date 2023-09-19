import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  entries: [
    'src/index',
    'src/types/index',
  ],
  externals: [
    // Type imports
    'vue',
  ],
})
