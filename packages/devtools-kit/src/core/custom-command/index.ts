import { devtoolsState } from '../general/state'

export interface CustomCommand {
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
  children?: Omit<CustomCommand, 'children'>[]
}

export function addCustomCommand(action: CustomCommand) {
  if ((devtoolsState.commands as unknown as CustomCommand[]).some(t => t.id === action.id))
    return

  devtoolsState.commands.push(action)
}

export function removeCustomCommand(actionId: CustomCommand['id']) {
  const index = (devtoolsState.commands as unknown as CustomCommand[]).findIndex(t => t.id === actionId)
  if (index === -1)
    return

  devtoolsState.commands.splice(index, 1)
}
