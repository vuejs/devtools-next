import type { App, Plugin, Ref } from 'vue'
import { inject, ref } from 'vue'
import { BridgeEvents } from '@vue-devtools-next/schema'
import type { BridgeInstanceType } from './bridge'

export interface DevToolsPluginOptions {
  bridge: BridgeInstanceType
}

function initDevToolsContext() {
  const connected = ref(false)
  const componentCount = ref(0)
  const vueVersion = ref('')

  function initBridge(bridge: DevToolsPluginOptions['bridge']) {
    // app connected
    bridge.on(BridgeEvents.APP_CONNECTED, (state = true) => {
      connected.value = state
    })

    // @TODO: types and may need a reactivity cross-messaging way ?
    bridge.on(BridgeEvents.UPDATE_DEVTOOLS_CONTEXT, (params) => {
      const { keys, values } = params
      keys.forEach((key) => {
        switch (key) {
          case 'connected':
            connected.value = values.connected
            break
          case 'componentCount':
            componentCount.value = values.componentCount
            break
          case 'activeAppVueVersion':
            vueVersion.value = values.activeAppVueVersion
            break
        }
      })
    })
  }

  return {
    initBridge,
    vueVersion,
    connected,
    componentCount,
  }
}

const VueDevToolsBridgeSymbol: InjectionKey<Ref<BridgeInstanceType>> = Symbol('VueDevToolsBridgeSymbol')
const VueDevToolsContextSymbol: InjectionKey<{ connected: Ref<boolean>; componentCount: Ref<number>; vueVersion: Ref<string> }> = Symbol('VueDevToolsContextSymbol')
export function createDevToolsVuePlugin(pluginOptions: DevToolsPluginOptions): Plugin {
  return {
    install(app: App, options) {
      // @TODO: refactor this
      const { bridge: _bridge } = pluginOptions
      const bridge = ref(_bridge) as Ref<DevToolsPluginOptions['bridge']>
      const context = initDevToolsContext()
      context.initBridge(bridge.value)
      app.provide(VueDevToolsBridgeSymbol, bridge)
      app.provide(VueDevToolsContextSymbol, context)
      app.config.globalProperties.__UPDATE_VUE_DEVTOOLS__ = (_bridge: DevToolsPluginOptions['bridge']) => {
        bridge.value = _bridge
        context.initBridge(bridge.value)
      }
    },
  }
}

export function useDevToolsBridge() {
  return inject(VueDevToolsBridgeSymbol)!
}

export function useDevToolsContext() {
  return inject(VueDevToolsContextSymbol)!
}
