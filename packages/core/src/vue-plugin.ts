import type { App, InjectionKey, Plugin } from 'vue'
import { inject } from 'vue'
import { createDevToolsHook } from './hook'

const VueDevToolsHookSymbol: InjectionKey<Record<string, any>> = Symbol('VueDevToolsHookSymbol')
export function createDevToolsVuePlugin(): Plugin {
  return {
    install(app: App, options) {
      app.provide(VueDevToolsHookSymbol, createDevToolsHook())
    },
  }
}

export function useDevToolsHook() {
  return inject(VueDevToolsHookSymbol)!
}
