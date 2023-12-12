import { devtools } from 'vue-devtools-kit'
import { stringify } from 'vue-devtools-kit/shared'
import { BridgeEvents } from './types'
import type { BridgeInstanceType } from './core'
import { BridgeRpcCore, bridgeRpcEvents } from './core'

export function registerBridgeRpc(bridge: BridgeInstanceType) {
  const bridgeRpcCore = new BridgeRpcCore(bridge)
  // devtools state getter
  bridgeRpcCore.on(bridgeRpcEvents.state, () => {
    return JSON.stringify({
      connected: devtools.state.connected,
      vueVersion: devtools.state?.activeAppRecord?.version || '',
      tabs: devtools.state.tabs,
      vitePluginDetected: devtools.state.vitePluginDetected,
      appRecords: devtools.state.appRecords.map(item => ({
        id: item.id,
        name: item.name,
        version: item.version,
      })),
    })
  })

  // devtools timeline layers getter
  bridgeRpcCore.on(bridgeRpcEvents.timelineLayer, () => {
    return JSON.stringify(devtools.context.timelineLayer)
  })

  // component inspector creator
  bridgeRpcCore.on(bridgeRpcEvents.toggleComponentInspector, (payload) => {
    devtools.context.api.toggleComponentInspector(payload!)
    return Promise.resolve(JSON.stringify({}))
  })

  // inspect component inspector
  bridgeRpcCore.on(bridgeRpcEvents.inspectComponentInspector, () => {
    return devtools.context.api.inspectComponentInspector()
  })

  // scroll to component
  bridgeRpcCore.on(bridgeRpcEvents.scrollToComponent, (payload) => {
    devtools.context.api.scrollToComponent(payload!)
    return Promise.resolve(JSON.stringify({}))
  })

  // component bounding rect getter
  bridgeRpcCore.on(bridgeRpcEvents.componentBoundingRect, async (payload) => {
    return devtools.context.api.getComponentBoundingRect(payload!)
  })

  // inspector tree getter
  bridgeRpcCore.on(bridgeRpcEvents.inspectorTree, (payload) => {
    return devtools.context.api.getInspectorTree(payload)
  })

  // inspector tree id updater
  bridgeRpcCore.on(bridgeRpcEvents.updateInspectorTreeId, async (payload) => {
    devtools.context.activeInspectorTreeId = payload!
  })

  // inspector state getter
  bridgeRpcCore.on(bridgeRpcEvents.inspectorState, async (payload) => {
    return devtools.context.api.getInspectorState(payload)
  })

  // inspector state editor
  bridgeRpcCore.on(bridgeRpcEvents.editState, async (payload) => {
    return devtools.context.api.editInspectorState(payload!)
  })

  // router info getter
  bridgeRpcCore.on(bridgeRpcEvents.routerInfo, () => {
    return JSON.stringify(devtools.context.routerInfo)
  })

  // router getter
  bridgeRpcCore.on(bridgeRpcEvents.router, (payload) => {
    devtools.context.router?.push(JSON.parse(payload!)).catch(e => e)
    return Promise.resolve(JSON.stringify({}))
  })

  // open in editor
  bridgeRpcCore.on(bridgeRpcEvents.openInEditor, async (payload) => {
    return devtools.context.api.openInEditor(JSON.parse(payload!))
  })

  // route matched
  bridgeRpcCore.on(bridgeRpcEvents.routeMatched, (payload) => {
    const c = console.warn
    console.warn = () => {}
    const matched = devtools.context.router?.resolve({
      path: payload || '/',
    }).matched ?? []
    console.warn = c
    return JSON.stringify(matched)
  })

  bridge.on(BridgeEvents.APP_CONNECTED, () => {
    bridge.emit(BridgeEvents.DEVTOOLS_STATE_UPDATED, JSON.stringify({
      vueVersion: devtools.state?.activeAppRecord?.version || '',
      connected: true,
    }))

    // devtools state updated
    devtools.context.api.on.devtoolsStateUpdated((payload) => {
      bridge.emit(BridgeEvents.DEVTOOLS_STATE_UPDATED, JSON.stringify({
        vueVersion: payload?.activeAppRecord?.version || '',
        connected: payload.connected,
      }))
    })

    // custom tabs updated
    devtools.context.api.on.customTabsUpdated((payload) => {
      bridge.emit(BridgeEvents.CUSTOM_TABS_UPDATED, JSON.stringify(payload))
    })

    // router info updated
    devtools.context.api.on.routerInfoUpdated((payload) => {
      bridge.emit(BridgeEvents.ROUTER_INFO_UPDATED, JSON.stringify(payload))
    })

    // inspector tree updated
    devtools.context.api.on.sendInspectorTree((payload) => {
      bridge.emit(BridgeEvents.SEND_INSPECTOR_TREE, payload)
    })

    // inspector state updated
    devtools.context.api.on.sendInspectorState((payload) => {
      bridge.emit(BridgeEvents.SEND_INSPECTOR_STATE, payload)
    })

    // add timeline event
    devtools.context.api.on.addTimelineEvent((payload) => {
      bridge.emit(BridgeEvents.ADD_TIMELINE_EVENT, stringify(payload))
    })
  })
}

export class BridgeRpc {

}
