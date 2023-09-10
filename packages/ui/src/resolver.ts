import type { ComponentResolver } from 'unplugin-vue-components'

export interface ComponentResolverOption {
  /**
   * Prefix for resolving components name.
   * Set '' to disable prefix.
   *
   * @default 'VD'
   */
  prefix?: string
  /**
   * Ignore components.
   * @default []
   */
  ignore?: string[]
}

export function ComponentsResolver(options: ComponentResolverOption = {}): ComponentResolver {
  return (name: string) => {
    const {
      prefix = options.prefix ?? 'VD',
      ignore = options.ignore ?? [],
    } = options

    if (!name.startsWith(prefix) || ignore.some(i => name.includes(i)))
      return

    return { from: `@vue-devtools-next/ui/components/${name.replace(prefix, '')}.vue` }
  }
}
