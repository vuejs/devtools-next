import { App, PluginDescriptor, PluginSetupFunction } from '../../types'
import { hook } from '../../hook'
import { devtoolsContext, devtoolsPluginBuffer } from '../../ctx'
import { DevToolsPluginAPI } from '../../api'

export * from './components'

export function setupDevToolsPlugin(pluginDescriptor: PluginDescriptor, setupFn: PluginSetupFunction) {
  return hook.setupDevToolsPlugin(pluginDescriptor, setupFn)
}

export function callDevToolsPluginSetupFn(plugin: [PluginDescriptor, PluginSetupFunction], app: App) {
  const [pluginDescriptor, setupFn] = plugin
  // @TODO: need check
  // if (pluginDescriptor.app !== app)
  // return

  const api = new DevToolsPluginAPI({
    plugin: {
      setupFn,
      descriptor: pluginDescriptor,
    },
    ctx: devtoolsContext,
  })

  // patch for vuex devtools
  if (pluginDescriptor.packageName === 'vuex') {
    api.on.editInspectorState((payload) => {
      api.sendInspectorState(payload.inspectorId)
    })
  }

  setupFn(api)
}
export function registerDevToolsPlugin(app: App) {
  devtoolsPluginBuffer.forEach((plugin) => {
    callDevToolsPluginSetupFn(plugin, app)
  })
}
