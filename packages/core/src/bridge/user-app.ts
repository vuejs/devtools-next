import type { EditStateEventPayload, EditStateType } from 'vue-devtools-kit'
import { devtools, editState } from 'vue-devtools-kit'
import { stringify } from 'vue-devtools-kit/shared'
import { BridgeEvents } from './types'
import { Bridge, bridgeRpcCore, bridgeRpcEvents } from './core'

export function registerBridgeRpc() {
  // devtools state getter
  bridgeRpcCore.on(bridgeRpcEvents.state, () => {
    return JSON.stringify({
      connected: devtools.state.connected,
      vueVersion: devtools.state?.activeAppRecord?.version || '',
    })
  })

  // devtools timeline layers getter
  bridgeRpcCore.on(bridgeRpcEvents.timelineLayer, () => {
    return JSON.stringify(devtools.context.timelineLayer)
  })

  // inspector tree getter
  bridgeRpcCore.on(bridgeRpcEvents.inspectorTree, (payload) => {
    return devtools.context.api.getInspectorTree(payload)
  })

  // inspector state getter
  bridgeRpcCore.on(bridgeRpcEvents.inspectorState, (payload) => {
    return devtools.context.api.getInspectorState(payload)
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

  Bridge.value.on(BridgeEvents.APP_CONNECTED, () => {
    Bridge.value.emit(BridgeEvents.DEVTOOLS_STATE_UPDATED, JSON.stringify({
      vueVersion: devtools.state?.activeAppRecord?.version || '',
      connected: true,
    }))

    // devtools state updated
    devtools.context.api.on.devtoolsStateUpdated((payload) => {
      Bridge.value.emit(BridgeEvents.DEVTOOLS_STATE_UPDATED, JSON.stringify({
        vueVersion: payload?.activeAppRecord?.version || '',
        connected: payload.connected,
      }))
    })

    // router info updated
    devtools.context.api.on.routerInfoUpdated((payload) => {
      Bridge.value.emit(BridgeEvents.ROUTER_INFO_UPDATED, JSON.stringify(payload))
    })

    // inspector tree updated
    devtools.context.api.on.sendInspectorTree((payload) => {
      Bridge.value.emit(BridgeEvents.SEND_INSPECTOR_TREE, payload)
    })

    // inspector state updated
    devtools.context.api.on.sendInspectorState((payload) => {
      Bridge.value.emit(BridgeEvents.SEND_INSPECTOR_STATE, payload)
    })

    // add timeline event
    devtools.context.api.on.addTimelineEvent((payload) => {
      Bridge.value.emit(BridgeEvents.ADD_TIMELINE_EVENT, stringify(payload))
    })
  })

  Bridge.value.on(BridgeEvents.EDIT_STATE, async (payload: EditStateEventPayload<EditStateType>) => {
    await editState(payload)
  })
}

export class BridgeRpc {

}
