import type { MaybeRefOrGetter } from 'vue'
import type { CustomTab } from 'vue-devtools-kit'

export interface ModuleBuiltinTab extends Pick<CustomTab, 'name' | 'icon' | 'title' | 'category'> {
  order?: number
  path: string
  show?: () => MaybeRefOrGetter<any>
  badge?: () => MaybeRefOrGetter<number | string | undefined>
  onClick?: () => void
}
