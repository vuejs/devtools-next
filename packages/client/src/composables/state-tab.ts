import type { ModuleBuiltinTab } from '~/types/tab'

export interface TabSettings {
  hiddenTabCategories: string[]
  hiddenTabs: string[]
  pinnedTabs: string[]
}

export interface CategorizedTab extends ModuleBuiltinTab {
  hidden: boolean
}

export const categorizedTabs = computed(() => {
  const { hiddenTabCategories, hiddenTabs, pinnedTabs } = devtoolsClientState.value.tabSettings
  // TODO: custom tabs
  const tabs = builtinTab.reduce<[string, CategorizedTab[]][]>((prev, [category, tabs]) => {
    const data: [string, CategorizedTab[]] = [category, []]
    tabs.forEach((tab) => {
      const hidden = hiddenTabs.includes(tab.name) || hiddenTabCategories.includes(category)

      if (pinnedTabs.includes(tab.name)) {
        prev[0][1].push({
          ...tab,
          hidden,
        })
      }
      else { data[1].push({ ...tab, hidden }) }
    })
    prev.push(data)
    return prev
  }, [['pinned', []]])
  // sort pinned tabs by pinned order
  tabs[0][1].sort((a, b) => pinnedTabs.indexOf(a.name) - pinnedTabs.indexOf(b.name))
  return tabs
})
