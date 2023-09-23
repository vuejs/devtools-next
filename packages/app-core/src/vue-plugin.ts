import type { App, Plugin } from 'vue'
import { inject, ref } from 'vue'
import { target } from '@vue-devtools-next/shared'
import { BridgeEvents } from '@vue-devtools-next/schema'
import type { Bridge } from './bridge'

export interface DevToolsPluginOptions {
  bridge: InstanceType<typeof Bridge>
}

function initDevToolsContext(bridge: DevToolsPluginOptions['bridge']) {
  // @TODO: bug fixes
  const connected = ref(!!target.__VUE_DEVTOOLS_CTX__?.connected)
  const componentCount = ref(target.__VUE_DEVTOOLS_CTX__?.componentCount)

  // app connected
  bridge.on(BridgeEvents.APP_CONNECTED, () => {
    connected.value = true
  })

  // component count updated
  bridge.on(BridgeEvents.COMPONENT_COUNT_UPDDATED, (count) => {
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
