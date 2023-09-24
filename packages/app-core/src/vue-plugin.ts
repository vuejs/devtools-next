import type { App, Plugin } from 'vue'
import { inject, ref } from 'vue'
import { BridgeEvents } from '@vue-devtools-next/schema'
import type { Bridge } from './bridge'
import { BridgeRpc } from './bridge'

export interface DevToolsPluginOptions {
  bridge: InstanceType<typeof Bridge>
}

function initDevToolsContext(bridge: DevToolsPluginOptions['bridge']) {
  const connected = ref(false)
  const componentCount = ref(0)

  BridgeRpc.getDataFromUserApp<{ data: { connected: boolean;componentCount: number } }>({ type: 'context' }).then((res) => {
    connected.value = res.data.connected
    componentCount.value = res.data.componentCount
  })

  // app connected
  bridge.on(BridgeEvents.APP_CONNECTED, () => {
    connected.value = true
  })

  // component count updated
  bridge.on(BridgeEvents.COMPONENT_COUNT_UPDATED, (count) => {
    // @TODO: bridge event type
    componentCount.value = count as number
  })

  return {
    connected,
    componentCount,
  }
}

const VueDevToolsBridgeSymbol: InjectionKey<InstanceType<typeof Bridge>> = Symbol('VueDevToolsBridgeSymbol')
const VueDevToolsContextSymbol: InjectionKey<{ connected: Ref<boolean>; componentCount: Ref<number> }> = Symbol('VueDevToolsContextSymbol')
export function createDevToolsVuePlugin(pluginOptions: DevToolsPluginOptions): Plugin {
  return {
    install(app: App, options) {
      const { bridge } = pluginOptions
      app.provide(VueDevToolsBridgeSymbol, bridge)
      app.provide(VueDevToolsContextSymbol, initDevToolsContext(bridge))
    },
  }
}

export function useDevToolsBridge() {
  return inject(VueDevToolsBridgeSymbol)!
}

export function useDevToolsContext() {
  return inject(VueDevToolsContextSymbol)!
}
