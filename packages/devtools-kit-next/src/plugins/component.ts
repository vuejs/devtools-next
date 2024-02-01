import { VueAppInstance } from '../types'
import { setupDevToolsPlugin } from '../api'

const INSPECTOR_ID = '__vue-devtools-component-plugin__'

export function registerComponentDevToolsPlugin(app: VueAppInstance) {
  setupDevToolsPlugin({
    id: INSPECTOR_ID,
    label: 'Components',
    app,
  }, (api) => {
    // @TODO
    api.addInspector({
      id: INSPECTOR_ID,
      label: 'Components',
      treeFilterPlaceholder: 'Search components',
    })
  })
}
