import type { App, InjectionKey, Plugin, Ref } from 'vue'
import { inject, ref } from 'vue'
import type { CustomTab } from 'vue-devtools-kit'
import type { AppRecord } from '@vue-devtools-next/schema'
import type { BridgeInstanceType } from './bridge/core'
import { DevToolsRpc } from './bridge'

export interface DevToolsPluginOptions {
  bridge: BridgeInstanceType
  viewMode: 'overlay' | 'panel'
}

function initDevToolsState() {
  const connected = ref(false)
  const componentCount = ref(0)
  const vueVersion = ref('')
  const tabs = ref<CustomTab[]>([])
  const vitePluginDetected = ref(false)
  const appRecords = ref<Array<Pick<AppRecord, 'name' | 'id' | 'version' | 'routerId'>>>([])
  const activeAppRecordId = ref('')

  function init() {
    DevToolsRpc.getDevToolsState().then(({ data }) => {
      connected.value = data.connected
      vueVersion.value = data.vueVersion || ''
      tabs.value = data.tabs
      vitePluginDetected.value = data.vitePluginDetected
      appRecords.value = data.appRecords
      activeAppRecordId.value = data.activeAppRecordId
    })
    DevToolsRpc.on.devtoolsStateUpdated((payload) => {
      connected.value = payload.connected
      vueVersion.value = payload.vueVersion || ''
      appRecords.value = payload.appRecords
      activeAppRecordId.value = payload.activeAppRecordId
    })
  }

  return {
    init,
    restore: init,
    vueVersion,
    connected,
    componentCount,
    tabs,
    vitePluginDetected,
    appRecords,
    activeAppRecordId,
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
const VueDevToolsStateSymbol: InjectionKey<{ connected: Ref<boolean>, componentCount: Ref<number>, vueVersion: Ref<string>, tabs: Ref<CustomTab[]>, vitePluginDetected: Ref<boolean>, appRecords: Ref<Array<Pick<AppRecord, 'name' | 'id' | 'version' | 'routerId'>>>, activeAppRecordId: Ref<string> }> = Symbol('VueDevToolsStateSymbol')
export function createDevToolsVuePlugin(pluginOptions: DevToolsPluginOptions): Plugin {
  return {
    install(app: App, options) {
      const { bridge: _bridge, viewMode: _viewMode } = pluginOptions
      const viewMode = ref(_viewMode)
      const state = initDevToolsState()
      const bridgeContext = initDevToolsBridge(_bridge)
      state.init()
      app.provide(VueDevToolsBridgeSymbol, bridgeContext.bridge)
      app.provide(VueDevToolsStateSymbol, state)
      app.provide('viewMode', viewMode)
      bridgeContext.bridge.value.on('toggle-view-mode', (v) => {
        viewMode.value = v
      })
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
