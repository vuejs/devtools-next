import type { App } from 'vue'
import { PluginDescriptor, PluginSetupFunction } from '../types'
import { devtoolsAppRecords, devtoolsState } from '../state'
import { hook } from '../hook'
import { getRouterDevToolsId } from '../core/router'
import { getInspector } from '../core/inspector'
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

  // @TODO: re-design the plugin api
  const extendedApi = new Proxy(api, {
    get(target, prop, receiver) {
      if (prop === 'getSettings') {
        return function () {
          const _settings = {}
          Object.keys(pluginDescriptor.settings!).forEach((key) => {
            _settings[key] = pluginDescriptor.settings![key].defaultValue
          })

          return _settings
        }
      }
      return Reflect.get(target, prop, receiver)
    },
    set(target, prop, value, receiver) {
      return Reflect.set(target, prop, value, receiver)
    },
  })
  setupFn(extendedApi)
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
        vueQuery: !!getInspector('vue-query'),
        vueRouter: !!globalProperties.$router,
        pinia: !!globalProperties.$pinia,
        vueI18n: !!globalProperties.$i18n,
      },
    }
  })
}
