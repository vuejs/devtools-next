import { DevToolsHooks } from '@vue/devtools-schema'
import type { PluginDescriptor, PluginSetupFunction, VueAppInstance } from '@vue/devtools-schema'
import { getAppRecord } from '../core/component/general'
import { devtoolsState } from '../core/general/state'
import { devtoolsHooks } from '../core/general/hook'
import { getRouterDevToolsId } from '../core/router'
import type { DevToolsPluginApi } from './index'

export function collectRegisteredPlugin(pluginDescriptor: PluginDescriptor, setupFn: PluginSetupFunction) {
  devtoolsState.pluginBuffer.push([pluginDescriptor, setupFn])
}

export async function registerPlugin(options: { app: VueAppInstance, api: DevToolsPluginApi }) {
  const { app, api } = options
  const plugins = devtoolsState.pluginBuffer.filter(([plugin]) => plugin.app === app)
  plugins.forEach(async ([plugin, setupFn]) => {
    if (plugin.packageName === 'vue-query') {
      /**
       * Skip it for now because plugin api doesn't support vue-query devtools plugin:
       * https://github.com/TanStack/query/blob/main/packages/vue-query/src/devtools/devtools.ts
       * @TODO: Need to discuss if we should be full compatible with the old devtools plugin api.
       */
      return
    }

    const appRecord = await getAppRecord(plugin.app)
    // edge case for router plugin
    if (plugin.packageName === 'vue-router') {
      const id = getRouterDevToolsId(`${plugin.id}`)
      if (plugin.app === app) {
        devtoolsState.appRecords = devtoolsState.appRecords.map(item => ({
          ...item,
          routerId: id,
        }))
      }
    }
    setupFn(api)
  })

  devtoolsState.appRecords = devtoolsState.appRecords.map((record) => {
    const globalProperties = record.app?.config?.globalProperties
    if (!globalProperties)
      return record
    return {
      ...record,
      moduleDetectives: {
        vueRouter: !!globalProperties.$router,
        pinia: !!globalProperties.$pinia,
      },
    }
  })
}

export function setupDevToolsPlugin(pluginDescriptor: PluginDescriptor, setupFn: PluginSetupFunction) {
  return devtoolsHooks.callHook(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, pluginDescriptor, setupFn)
}
