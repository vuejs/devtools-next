import type { App } from 'vue'
import { devtoolsAppRecords, devtoolsState } from '../state'
import { hook } from '../hook'
// import { getRouterDevToolsId } from '../core/router'
import { getInspector } from '../core/inspector'

export function collectDevToolsPlugin(pluginDescriptor: any, setupFn: any) {
  devtoolsState.pluginBuffer.push([pluginDescriptor, setupFn])
}

export function setupDevToolsPlugin(pluginDescriptor: any, setupFn: any) {
  return hook.setupDevToolsPlugin(pluginDescriptor, setupFn)
}

export function setupExternalPlugin(plugin: [any, any], app: App<any>) {
  const [pluginDescriptor, setupFn] = plugin
  // if (pluginDescriptor.app !== app)
  //   return

  // edge case for router plugin
  // if (pluginDescriptor.packageName === 'vue-router') {
  //   const id = getRouterDevToolsId(`${pluginDescriptor.id}`)
  //   if (pluginDescriptor.app === app) {
  //     devtoolsAppRecords.value = devtoolsAppRecords.value.map(item => ({
  //       ...item,
  //       routerId: id,
  //     }))
  //   }
  // }

  // @TODO: re-design the plugin api
  // const extendedApi = new Proxy(api, {
  //   get(target, prop, receiver) {
  //     if (prop === 'getSettings') {
  //       return function () {
  //         const _settings = {}
  //         Object.keys(pluginDescriptor.settings!).forEach((key) => {
  //           _settings[key] = pluginDescriptor.settings![key].defaultValue
  //         })

  //         return _settings
  //       }
  //     }
  //     return Reflect.get(target, prop, receiver)
  //   },
  //   set(target, prop, value, receiver) {
  //     return Reflect.set(target, prop, value, receiver)
  //   },
  // })
  // setupFn(new DevToolsPluginAPI({
  //   plugin: {
  //     setupFn,
  //     descriptor: pluginDescriptor,
  //   },
  //   ctx: devtoolsContext,
  // }))
  // setupFn(extendedApi)
}

export function updatePluginDetectives() {
  devtoolsAppRecords.value = devtoolsAppRecords.value.map((record) => {
    const globalProperties = record.app?.config?.globalProperties
    if (!globalProperties)
      return record

    return {
      ...record,
      moduleDetectives: {
        vueQuery: !!getInspector('vue-query'),
        veeValidate: !!getInspector('vee-validate-inspector'),
        vueRouter: !!globalProperties.$router,
        pinia: !!globalProperties.$pinia,
        vueI18n: !!globalProperties.$i18n,
        vuex: !!globalProperties.$store,
      },
    }
  })
}

export function registerPlugin(app: App<any>) {
  devtoolsState.pluginBuffer.forEach(plugin => setupExternalPlugin(plugin, app))
  updatePluginDetectives()
}
