import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    overrides: {
      vue: {
        'vue/no-v-text-v-html-on-component': 'off',
      },
      typescript: {
        'no-console': 'off',
        '@typescript-eslint/ban-types': 'off',
        'n/prefer-global/process': 'off',
        'antfu/top-level-function': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        'unused-imports/no-unused-vars': 'off',
        'node/prefer-global/process': 'off',
        '@typescript-eslint/no-invalid-this': 'off',
      },
    },
  },
)
