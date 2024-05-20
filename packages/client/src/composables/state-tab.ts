import { onCustomTabsUpdated } from '@vue/devtools-core'
import type { MaybeRef } from 'vue'
import type { CustomTab } from '@vue/devtools-kit'
import { isInElectron } from '@vue/devtools-shared'

import type { ModuleBuiltinTab } from '~/types/tab'

export interface TabSettings {
  hiddenTabCategories: string[]
  hiddenTabs: string[]
  pinnedTabs: string[]
}

export interface CategorizedTab extends ModuleBuiltinTab {
  hidden: boolean
}

export interface CategorizedCategory {
  name: string
  hidden: boolean
}

export type CategorizedTabs = [CategorizedCategory, CategorizedTab[]][]

let removeTabsUpdatedListener: (() => void) | null = null

export function useAllTabs() {
  const state = useDevToolsState()
  const customTabs = ref<CustomTab[]>(state.tabs.value || [])
  const allTabs = computed(() => {
    const vitePluginDetected = state.vitePluginDetected.value
    const tabs = [...getBuiltinTab(vitePluginDetected, activeAppRecord.value?.moduleDetectives)]
    customTabs.value.forEach((tab) => {
      const currentTab: [string, Array<ModuleBuiltinTab | CustomTab>] | undefined = tabs.find(t => t[0] === tab.category)
      if (currentTab) {
        if (currentTab[1].some(t => t.name === tab.name))
          return

        // @TODO: electron app support vite only tabs
        if ((!vitePluginDetected || isInElectron) && viteOnlyTabs.includes(tab.name))
          return

        currentTab[1].push({
          ...tab,
        })
      }
    })
    return tabs
  })
  const flattenedTabs = computed(() => {
    return allTabs.value.reduce((prev, [_, tabs]) => {
      tabs.forEach((tab) => {
        prev.push(tab)
      })
      return prev
    }, [] as Array<ModuleBuiltinTab | CustomTab>)
  })
  const categorizedTabs = computed(() => {
    const { hiddenTabCategories, hiddenTabs, pinnedTabs } = devtoolsClientState.value.tabSettings
    const pinnedHidden = hiddenTabCategories.includes('pinned')
    // TODO: custom tabs
    const tabs = allTabs.value.reduce<CategorizedTabs>((prev, [category, tabs]) => {
      const data: [CategorizedCategory, CategorizedTab[]] = [{ hidden: false, name: category }, []]
      const categoryHidden = hiddenTabCategories.includes(category)
      tabs.forEach((tab) => {
        const tabHidden = hiddenTabs.includes(tab.name)

        if (pinnedTabs.includes(tab.name)) {
          prev[0][1].push({
            ...tab,
            hidden: tabHidden || pinnedHidden,
          })
        }
        else {
          const hidden = tabHidden || categoryHidden
          data[1].push({ ...tab, hidden })
        }
      })
      data[0].hidden = data[1].every(t => t.hidden)
      prev.push(data)
      return prev
    }, [[{ name: 'pinned', hidden: false }, []]])

    // set pinned category hidden value
    tabs[0][0].hidden = tabs[0][1].every(t => t.hidden)

    // sort pinned tabs by pinned order
    tabs[0][1].sort((a, b) => pinnedTabs.indexOf(a.name) - pinnedTabs.indexOf(b.name))
    return tabs
  })
  const enabledTabs = computed(() => {
    return categorizedTabs.value.reduce<CategorizedTabs>((prev, [meta, tabs]) => {
      if (meta.hidden)
        return prev
      const filtered = tabs.filter(t => !t.hidden)
      if (filtered.length)
        prev.push([meta, filtered])
      return prev
    }, [])
  })
  const enabledFlattenTabs = computed(() => {
    return enabledTabs.value.reduce((prev, [_, tabs]) => {
      tabs.forEach((tab) => {
        prev.push(tab)
      })
      return prev
    }, [] as Array<ModuleBuiltinTab | CustomTab>)
  })

  onDevToolsClientConnected(() => {
    removeTabsUpdatedListener?.()
    removeTabsUpdatedListener = onCustomTabsUpdated((data) => {
      customTabs.value = data
    })
  })

  return { categorizedTabs, flattenedTabs, enabledTabs, enabledFlattenTabs }
}

export function getCategorizedTabs(flattenTabs: MaybeRef<(CustomTab | ModuleBuiltinTab)[]>, enabledTabs: MaybeRef<CategorizedTabs>) {
  return computed<CategorizedTabs>(() => {
    const categories: CategorizedTabs = []
    const pinnedTabs = devtoolsClientState.value.tabSettings.pinnedTabs
    const tabs = toValue(enabledTabs).reduce<{ tab: CategorizedTab, category: CategorizedCategory }[]>((prev, [{ name: cateName, hidden }, tabs]) => {
      tabs.forEach((tab) => {
        if (toValue(flattenTabs).some(i => i.name === tab.name)) {
          const category = pinnedTabs.includes(tab.name) ? 'pinned' : (cateName || 'app')
          prev.push({
            tab,
            category: {
              name: category,
              hidden,
            },
          })
        }
      })
      return prev
    }, [])
    tabs.forEach(({ tab, category }) => {
      const cates = categories.find(([{ name }]) => name === category.name)
      if (!cates)
        categories.push([category, [tab]])
      else
        cates[1].push(tab)
    })
    const pinned = categories.find(([{ name }]) => name === 'pinned')
    if (pinned)
      pinned[1].sort((a, b) => pinnedTabs.indexOf(a.name) - pinnedTabs.indexOf(b.name))
    return categories
  })
}
