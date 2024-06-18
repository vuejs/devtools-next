import { Linter } from 'eslint'
import noVueRuntime from './rules/no-vue-runtime-import'

export default {
  rules: {
    'no-vue-runtime-import': noVueRuntime,
  },
} satisfies Linter.FlatConfig<{
  'no-vue-runtime-import': any
}>
