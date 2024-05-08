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

export function setupExternalPlugin(plugin: [PluginDescriptor, PluginSetupFunction], app: App<any>, api: DevToolsPluginApi) {
  const [pluginDescriptor, setupFn] = plugin
  if (pluginDescriptor.app !== app)
    return

  console.log('x', pluginDescriptor)
  // if (pluginDescriptor.packageName === 'vue-query') {
  //   /**
  //    * Skip it for now because plugin api doesn't support vue-query devtools plugin:
  //    * https://github.com/TanStack/query/blob/main/packages/vue-query/src/devtools/devtools.ts
  //    * @TODO: Need to discuss if we should be full compatible with the old devtools plugin api.
  //    */
  //   return
  // }

  // edge case for router plugin
  if (pluginDescriptor.packageName === 'vue-router') {
    const id = getRouterDevToolsId(`${pluginDescriptor.id}`)
    if (pluginDescriptor.app === app) {
      devtoolsAppRecords.value = devtoolsAppRecords.value.map(item => ({
        ...item,
        routerId: id,
      }))
    }
  }
  setupFn(api)
}

export function registerPlugin(app: App<any>, api: DevToolsPluginApi) {
  devtoolsState.pluginBuffer.forEach(plugin => setupExternalPlugin(plugin, app, api))
  devtoolsAppRecords.value = devtoolsAppRecords.value.map((record) => {
    const globalProperties = record.app?.config?.globalProperties
    if (!globalProperties)
      return record

    return {
      ...record,
      moduleDetectives: {
        vueQuery: true,
        vueRouter: !!globalProperties.$router,
        pinia: !!globalProperties.$pinia,
        vueI18n: !!globalProperties.$i18n,
      },
    }
  })
}
