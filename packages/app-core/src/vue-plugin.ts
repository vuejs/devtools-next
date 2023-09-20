import type { App, Plugin } from 'vue'
import { target } from '@vue-devtools-next/shared'
import { BridgeEvents } from '@vue-devtools-next/schema'
import { Bridge } from './bridge'

// import { inject } from 'vue'
// import { createDevToolsHook } from './hook'

// const VueDevToolsHookSymbol: InjectionKey<Record<string, any>> = Symbol('VueDevToolsHookSymbol')
export function createDevToolsVuePlugin(): Plugin {
  return {
    install(app: App, options) {
      Bridge.value.on(BridgeEvents.APP_CONNECTED, () => {
      })
      // app.provide(VueDevToolsHookSymbol, createDevToolsHook())
    },
  }
}

// export function useDevToolsHook() {
//   return inject(VueDevToolsHookSymbol)!
// }

export function useDevToolsBridge() {
  return target.__VUE_DEVTOOLS_BRIDGE__
}
