import type { MaybeRefOrGetter } from 'vue'

type TabCategory =
  | 'pinned'
  | 'app'
  | 'modules'
  | 'advanced'

export interface ModuleBuiltinTab {
  name: string
  icon?: string
  title?: string
  order?: number
  path?: string
  category?: TabCategory
  show?: () => MaybeRefOrGetter<any>
  badge?: () => MaybeRefOrGetter<number | string | undefined>
  onClick?: () => void
}
