import { useDevToolsBridgeRpc, useDevToolsState } from '@vue/devtools-core'
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
    // TODO: custom tabs
    const tabs = allTabs.value.reduce<CategorizedTabs>((prev, [category, tabs]) => {
      const data: [CategorizedCategory, CategorizedTab[]] = [{ hidden: false, name: category }, []]
      let hiddenCount = 0
      tabs.forEach((tab) => {
        const hidden = hiddenTabs.includes(tab.name) || hiddenTabCategories.includes(category)
        if (hidden)
          hiddenCount += 1

        if (pinnedTabs.includes(tab.name)) {
          prev[0][1].push({
            ...tab,
            hidden,
          })
        }
        else { data[1].push({ ...tab, hidden }) }
      })
      if (hiddenCount === tabs.length)
        data[0].hidden = true
      prev.push(data)
      return prev
    }, [[{ name: 'pinned', hidden: false }, []]])

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

  const bridgeRpc = useDevToolsBridgeRpc()
  onDevToolsClientConnected(() => {
    bridgeRpc.on.customTabsUpdated((data) => {
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
      pinned.sort((a, b) => pinnedTabs.indexOf(a[0].name) - pinnedTabs.indexOf(b[0].name))
    return categories
  })
}
