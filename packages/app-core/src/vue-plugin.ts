import type { App, Plugin, Ref } from 'vue'
import { inject, ref } from 'vue'
import { BridgeEvents } from '@vue-devtools-next/schema'
import type { Bridge } from './bridge'
import { BridgeRpc } from './bridge'

export interface DevToolsPluginOptions {
  bridge: InstanceType<typeof Bridge>
}

function initDevToolsContext() {
  const connected = ref(false)
  const componentCount = ref(0)

  function initBridge(bridge: DevToolsPluginOptions['bridge']) {
    // app connected
    bridge.on(BridgeEvents.APP_CONNECTED, (state = true) => {
      connected.value = state
    })

    // component count updated
    bridge.on(BridgeEvents.COMPONENT_COUNT_UPDATED, (count) => {
    // @TODO: bridge event type
      componentCount.value = count as number
    })
    BridgeRpc.getDataFromUserApp<{ data: { connected: boolean;componentCount: number } }>({ type: 'context' }).then((res) => {
      connected.value = res.data.connected
      componentCount.value = res.data.componentCount
    })
  }

  return {
    initBridge,
    connected,
    componentCount,
  }
}

const VueDevToolsBridgeSymbol: InjectionKey<Ref<InstanceType<typeof Bridge>>> = Symbol('VueDevToolsBridgeSymbol')
const VueDevToolsContextSymbol: InjectionKey<{ connected: Ref<boolean>; componentCount: Ref<number> }> = Symbol('VueDevToolsContextSymbol')
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
