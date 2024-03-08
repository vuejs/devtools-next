import * as devtoolsActions from './devtools-actions'
import * as devtoolsListeners from './devtools-listeners'

export function initDevToolsAEvent() {
  Object.values(devtoolsActions).forEach((action) => {
    action()
  })
  Object.values(devtoolsListeners).forEach((action) => {
    action(() => {})
  })
}
