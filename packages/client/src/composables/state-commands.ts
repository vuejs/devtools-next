import { randomStr } from '@vue-devtools-next/shared'
import { MaybeRefOrGetter } from 'vue'

export interface CommandItem {
  id: string
  title: string
  description?: string
  icon?: string
  action: () => void | CommandItem[] | Promise<CommandItem[] | void>
}

const registeredCommands = reactive(new Map<string, MaybeRefOrGetter<CommandItem[]>>())

// @unocss-include
export function useCommands() {
  const { enabledFlattenTabs } = useAllTabs()
  const router = useRouter()

  const fixedCommands: CommandItem[] = [
    {
      id: 'fixed:settings',
      title: 'Settings',
      icon: 'carbon-settings-adjust',
      action: () => {
        router.push('/settings')
      },
    },
    {
      id: 'fixed:docs',
      title: 'Vue Documentations',
      icon: 'i-vscode-icons-file-type-vue',
      action: () => {
        return getVueDocsCommands()
      },
    },
  ]

  const tabCommands = computed(() => enabledFlattenTabs.value
    .map((i): CommandItem => {
      return {
        id: `tab:${i.name}`,
        title: i.title || i.name,
        icon: i.icon,
        action: () => {
          if ('onClick' in i && i.onClick)
            i.onClick()
          else
            router.push(('path' in i && i.path) ? i.path : `/custom-tab-view/${i.name}`)
        },
      }
    }))

  return computed(() => {
    return [
      ...fixedCommands,
      ...tabCommands.value,
      ...Array.from(registeredCommands.values())
        .flatMap(i => toValue(i)),
    ]
  })
}

export function registerCommands(getter: MaybeRefOrGetter<CommandItem[]>) {
  const id = randomStr()

  registeredCommands.set(id, getter)

  onUnmounted(() => {
    registeredCommands.delete(id)
  })
}

let _vueDocsCommands: CommandItem[] | undefined

export async function getVueDocsCommands() {
  if (!_vueDocsCommands) {
    const list = await import('../../data/vue-apis.json').then(i => i.default)
    _vueDocsCommands = list.map(i => ({
      ...i,
      icon: 'carbon-api-1',
      action: () => {
        window.open(i.url, '_blank')
      },
    }))
  }
  return _vueDocsCommands
}
