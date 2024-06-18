import { createRule, isTypeImport } from '../../utils'

export default createRule<'no-vue-runtime-import', [{ prefer: string }]>({
  meta: {
    type: 'problem',
    messages: {
      'no-vue-runtime-import': 'Please consider import runtime APIs from {{prefer}}.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          prefer: {
            type: 'string',
          },
        },
      },
    ],
  },
  create(context) {
    const options = context.options[0]

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value

        const shouldSkip = isTypeImport(node)

        if (node.importKind === 'type' || shouldSkip || importSource !== 'vue')
          return

        context.report({
          node: node.source,
          messageId: 'no-vue-runtime-import',
          loc: node.source.loc,
          data: {
            prefer: options?.prefer ?? '<set prefer in your eslint>',
          },
        })
      },
    }
  },
})
