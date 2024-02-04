import type { App } from 'vue'
import { PluginDescriptor, PluginSetupFunction } from '../types'
import { devtoolsAppRecords, devtoolsState } from '../state'
import { hook } from '../hook'
import { getRouterDevToolsId } from '../core/router'
import type { DevToolsPluginApi } from './api'

export function collectDevToolsPlugin(pluginDescriptor: PluginDescriptor, setupFn: PluginSetupFunction) {
  devtoolsState.pluginBuffer.push([pluginDescriptor, setupFn])
}

export function setupDevToolsPlugin(pluginDescriptor: PluginDescriptor, setupFn: PluginSetupFunction) {
  return hook.setupDevToolsPlugin(pluginDescriptor, setupFn)
}

export function registerPlugin(app: App<any>, api: DevToolsPluginApi) {
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

    // edge case for router plugin
    if (plugin.packageName === 'vue-router') {
      const id = getRouterDevToolsId(`${plugin.id}`)
      if (plugin.app === app) {
        devtoolsAppRecords.value = devtoolsAppRecords.value.map(item => ({
          ...item,
          routerId: id,
        }))
      }
    }
    setupFn(api)
  })

  devtoolsAppRecords.value = devtoolsAppRecords.value.map((record) => {
    const globalProperties = record.app?.config?.globalProperties
    if (!globalProperties)
      return record

    return {
      ...record,
      moduleDetectives: {
        vueRouter: !!globalProperties.$router,
        pinia: !!globalProperties.$pinia,
        vueI18n: !!globalProperties.$i18n,
      },
    }
  })
}
