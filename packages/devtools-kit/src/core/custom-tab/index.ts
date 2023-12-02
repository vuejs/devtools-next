import { devtoolsState } from '../general/state'
import type { CustomTab } from './types'

export type { CustomTab } from './types'

export function addCustomTab(tab: CustomTab) {
  if ((devtoolsState.tabs as unknown as CustomTab[]).some(t => t.name === tab.name))
    return

  devtoolsState.tabs.push(tab)
}
