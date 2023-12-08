import { useDevToolsBridgeRpc, useDevToolsState } from '@vue-devtools-next/core'
import type { CustomTab } from 'vue-devtools-kit'
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

export function useAllTabs() {
  const state = useDevToolsState()
  const customTabs = ref<CustomTab[]>(state.tabs.value || [])
  const allTabs = computed(() => {
    const vitePluginDetected = state.vitePluginDetected.value
    const tabs = [...getBuiltinTab(vitePluginDetected)]
    customTabs.value.forEach((tab) => {
      const currentTab: [string, Array<ModuleBuiltinTab | CustomTab>] | undefined = tabs.find(t => t[0] === tab.category)
      if (currentTab) {
        if (currentTab[1].some(t => t.name === tab.name))
          return
        if (!vitePluginDetected && viteOnlyTabs.includes(tab.name))
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
    const tabs = allTabs.value.reduce<[CategorizedCategory, CategorizedTab[]][]>((prev, [category, tabs]) => {
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
  const bridgeRpc = useDevToolsBridgeRpc()
  onDevToolsClientConnected(() => {
    bridgeRpc.on.customTabsUpdated((data) => {
      customTabs.value = data
    })
  })

  return { categorizedTabs, flattenedTabs }
}
