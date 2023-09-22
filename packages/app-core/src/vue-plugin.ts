import type { App, Plugin } from 'vue'
import { inject } from 'vue'
import { BridgeEvents } from '@vue-devtools-next/schema'
import { Bridge } from './bridge'

export interface DevToolsPluginOptions {
  bridge: InstanceType<typeof Bridge>
}

const VueDevToolsBridgeSymbol: InjectionKey<InstanceType<typeof Bridge>> = Symbol('VueDevToolsBridgeSymbol')
export function createDevToolsVuePlugin(pluginOptions: DevToolsPluginOptions): Plugin {
  return {
    install(app: App, options) {
      Bridge.value.on(BridgeEvents.APP_CONNECTED, () => {
      })
      app.provide(VueDevToolsBridgeSymbol, Bridge.value)
    },
  }
}

export function useDevToolsBridge() {
  return inject(VueDevToolsBridgeSymbol)!
}
