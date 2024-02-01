import { devtoolsState } from '../../state'
import type { CustomTab } from './types'

export type { CustomTab } from './types'

export function addCustomTab(tab: CustomTab) {
  if (devtoolsState.tabs.some(t => t.name === tab.name))
    return

  devtoolsState.tabs.push(tab)
}
