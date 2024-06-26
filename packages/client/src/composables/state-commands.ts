import { randomStr } from '@vue/devtools-shared'
import { CustomCommand } from '@vue/devtools-kit'
import { MaybeRefOrGetter } from 'vue'
import { useDevToolsState } from '@vue/devtools-core'

export interface CommandItem {
  id: string
  title: string
  description?: string
  icon?: string
  order?: number
  action: () => void | CommandItem[] | Promise<CommandItem[] | void>
}

function uniqueById(items: CommandItem[]): CommandItem[] {
  const unique = new Map<number | string, CommandItem>()
  items.forEach(item => unique.set(item.id, item))
  return Array.from(unique.values())
}

const registeredCommands = reactive(new Map<string, MaybeRefOrGetter<CommandItem[]>>())

// @unocss-include
export function useCommands() {
  const { enabledFlattenTabs } = useAllTabs()
  const router = useRouter()
  const state = useDevToolsState()

  const customCommands = ref<CustomCommand[]>(state.commands.value || [])

  watchEffect(() => {
    customCommands.value = state.commands.value || []
  })

  const fixedCommands: CommandItem[] = [
    {
      id: 'fixed:settings',
      title: 'Settings',
      icon: 'i-carbon-settings-adjust',
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
    return uniqueById([
      ...fixedCommands,
      ...tabCommands.value,
      ...resolveCustomCommands(customCommands.value),
      ...Array.from(registeredCommands.values())
        .flatMap(i => toValue(i)),
    ])
  })
}

function resolveCustomAction(action: CustomCommand['action']) {
  if (action?.type === 'url')
    window.open(action.src, '_blank')
  // TODO: support more types
}

function resolveCustomCommands(commands: CustomCommand[]) {
  return commands.map(i => ({
    id: `${i.id}`,
    title: i.title,
    icon: i.icon,
    description: i.description,
    order: i.order,
    action: () => {
      // priority: children > url > undefined
      if (i.children) {
        return i.children.map(i => ({
          id: i.id,
          title: i.title,
          icon: i.icon,
          description: i.description,
          order: i.order,
          action: () => {
            resolveCustomAction(i.action)
          },
        })).sort((a, b) => {
          return (b.order ?? 0) - (a.order ?? 0)
        })
      }
      resolveCustomAction(i.action)
    },
  })).sort((a, b) => {
    return (b.order ?? 0) - (a.order ?? 0)
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
