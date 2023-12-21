import { devtoolsState } from '../general/state'

export interface CustomAction {
  /**
   * The id of the command, should be unique
   */
  id: string
  title: string
  description?: string
  /**
   * Icon of the tab, support any Iconify icons, or a url to an image
   */
  icon?: string
  /**
   * - Url of the action, if set, execute the action will open the url
   * - __NOTE__: This will be ignored if `children` is set
   */
  url?: string
  /**
   * - children of action, if set, execute the action will show the children
   */
  children?: Omit<CustomAction, 'children'>[]
}

export function addCustomAction(action: CustomAction) {
  if ((devtoolsState.actions as unknown as CustomAction[]).some(t => t.id === action.id))
    return

  devtoolsState.actions.push(action)
}

export function removeCustomAction(action: CustomAction) {
  const index = (devtoolsState.actions as unknown as CustomAction[]).findIndex(t => t.id === action.id)
  if (index === -1)
    return

  devtoolsState.actions.splice(index, 1)
}
