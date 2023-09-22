import type { App, Plugin } from 'vue'
import { inject, ref } from 'vue'
import { target } from '@vue-devtools-next/shared'
import { BridgeEvents } from '@vue-devtools-next/schema'
import type { Bridge } from './bridge'

export interface DevToolsPluginOptions {
  bridge: InstanceType<typeof Bridge>
}

function initDevToolsContext(bridge: DevToolsPluginOptions['bridge']) {
  const connected = ref(!!target.__VUE_DEVTOOLS_CTX__?.connected)
  bridge.on(BridgeEvents.APP_CONNECTED, () => {
    connected.value = true
  })
  return {
    connected,
  }
}

const VueDevToolsBridgeSymbol: InjectionKey<InstanceType<typeof Bridge>> = Symbol('VueDevToolsBridgeSymbol')
const VueDevToolsContextSymbol: InjectionKey<{ connected: Ref<boolean> }> = Symbol('VueDevToolsContextSymbol')
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
