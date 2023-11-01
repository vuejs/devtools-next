import type { App, Plugin, Ref } from 'vue'
import { inject, ref } from 'vue'
import type { BridgeInstanceType } from './bridge/core'
import { DevToolsRpc } from './bridge'

export interface DevToolsPluginOptions {
  bridge: BridgeInstanceType
}

function initDevToolsState() {
  const connected = ref(false)
  const componentCount = ref(0)
  const vueVersion = ref('')

  function init() {
    DevToolsRpc.getDevToolsState().then(({ data }) => {
      connected.value = data.connected
      vueVersion.value = data.vueVersion || ''
    })
    DevToolsRpc.on.devtoolsStateUpdated((payload) => {
      connected.value = payload.connected
      vueVersion.value = payload.vueVersion || ''
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
  const bridge = ref<DevToolsPluginOptions['bridge']>(_bridge)

  function restore(_bridge: DevToolsPluginOptions['bridge']) {
    bridge.value = _bridge
  }
  return {
    bridge,
    restore,
  }
}

const VueDevToolsBridgeSymbol: InjectionKey<Ref<BridgeInstanceType>> = Symbol('VueDevToolsBridgeSymbol')
const VueDevToolsStateSymbol: InjectionKey<{ connected: Ref<boolean>; componentCount: Ref<number>; vueVersion: Ref<string> }> = Symbol('VueDevToolsStateSymbol')
export function createDevToolsVuePlugin(pluginOptions: DevToolsPluginOptions): Plugin {
  return {
    install(app: App, options) {
      const { bridge: _bridge } = pluginOptions
      const state = initDevToolsState()
      const bridgeContext = initDevToolsBridge(_bridge)
      state.init()
      app.provide(VueDevToolsBridgeSymbol, bridgeContext.bridge)
      app.provide(VueDevToolsStateSymbol, state)
      app.config.globalProperties.__VUE_DEVTOOLS_UPDATE__ = (_bridge: DevToolsPluginOptions['bridge']) => {
        bridgeContext.restore(_bridge)
        state.restore()
      }
    },
  }
}

export function useDevToolsBridge() {
  return inject(VueDevToolsBridgeSymbol)!
}

export function useDevToolsBridgeRpc() {
  return DevToolsRpc
}

export function useDevToolsState() {
  return inject(VueDevToolsStateSymbol)!
}
