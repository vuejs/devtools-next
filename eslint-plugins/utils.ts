import type { TSESLint, TSESTree } from '@typescript-eslint/utils'
import type { Rule } from 'eslint'

export function createRule<MessageIds extends string, RuleOptions extends any[]>(
  rule: Omit<TSESLint.RuleModule<MessageIds, RuleOptions>, 'defaultOptions'>,
) {
  return rule as unknown as Rule.RuleModule
}

export function isTypeImport(node: TSESTree.ImportDeclaration) {
  return node.importKind === 'type'
    || node.specifiers.filter((s) => {
      if (s.type !== 'ImportSpecifier')
        return true
      if (s.importKind !== 'type')
        return true
      return false
    }).length === 0
}
