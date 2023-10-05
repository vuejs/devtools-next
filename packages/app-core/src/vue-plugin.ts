import type { App, Plugin, Ref } from 'vue'
import { inject, ref } from 'vue'
import type { BridgeInstanceType } from './bridge'
import { BridgeApi } from './bridge'

export interface DevToolsPluginOptions {
  bridge: BridgeInstanceType
}

function initDevToolsContext() {
  const connected = ref(false)
  const componentCount = ref(0)
  const vueVersion = ref('')

  function init() {
    BridgeApi.getDevToolsContext((payload) => {
      connected.value = payload.connected
      componentCount.value = payload.componentCount
      vueVersion.value = payload.activeAppVueVersion
    })
  }

  return {
    init,
    restore: init,
    vueVersion,
    connected,
    componentCount,
  }
}

function initDevToolsBridge(_bridge: DevToolsPluginOptions['bridge']) {
  const bridge = ref(_bridge) as Ref<DevToolsPluginOptions['bridge']>

  function restore(_bridge: DevToolsPluginOptions['bridge']) {
    bridge.value = _bridge
  }
  return {
    bridge,
    restore,
  }
}

const VueDevToolsBridgeSymbol: InjectionKey<Ref<BridgeInstanceType>> = Symbol('VueDevToolsBridgeSymbol')
const VueDevToolsContextSymbol: InjectionKey<{ connected: Ref<boolean>; componentCount: Ref<number>; vueVersion: Ref<string> }> = Symbol('VueDevToolsContextSymbol')
export function createDevToolsVuePlugin(pluginOptions: DevToolsPluginOptions): Plugin {
  return {
    install(app: App, options) {
      const { bridge: _bridge } = pluginOptions
      const context = initDevToolsContext()
      const bridgeContext = initDevToolsBridge(_bridge)
      context.init()
      app.provide(VueDevToolsBridgeSymbol, bridgeContext.bridge)
      app.provide(VueDevToolsContextSymbol, context)
      app.config.globalProperties.__VUE_DEVTOOLS_UPDATE__ = (_bridge: DevToolsPluginOptions['bridge']) => {
        bridgeContext.restore(_bridge)
        context.restore()
      }
    },
  }
}

export function useDevToolsBridge() {
  return inject(VueDevToolsBridgeSymbol)!
}

export function useDevToolsBridgeApi() {
  return BridgeApi
}

export function useDevToolsContext() {
  return inject(VueDevToolsContextSymbol)!
}
