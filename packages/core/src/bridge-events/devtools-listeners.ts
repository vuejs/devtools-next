import type { ComponentTreeNode, CustomCommand, CustomTab, TimelineEvent } from '@vue/devtools-kit'
import { defineDevToolsListener } from '../bridge'

export const onDevToolsStateUpdated = defineDevToolsListener<any & { vueVersion: string }>('devtools:on-state-updated', (devtools, callback) => {
  function setPayload(payload: any & { vueVersion?: string }) {
    return {
      vueVersion: payload?.activeAppRecord?.version || '',
      connected: payload.connected,
      clientConnected: payload.clientConnected,
      tabs: payload.tabs,
      commands: payload.commands,
      vitePluginDetected: payload.vitePluginDetected,
      appRecords: payload.appRecords.map(item => ({
        id: item.id,
        name: item.name,
        version: item.version,
        routerId: item.routerId,
        moduleDetectives: item.moduleDetectives,
      })),
      activeAppRecordId: payload.activeAppRecordId,
    }
  }
  function subscribe() {
    devtools.api.on.devtoolsStateUpdated((payload) => {
      callback(setPayload(payload))
    })
  }
  if (devtools?.api) {
    subscribe()
  }
  else {
    const timer = setInterval(() => {
      if (devtools.state.connected) {
        const payload = devtools.state
        callback(setPayload(payload))
        subscribe()
        clearInterval(timer)
      }
    }, 10)
  }
})

export const onCustomTabsUpdated = defineDevToolsListener<CustomTab[]>('devtools:on-custom-tabs-updated', (devtools, callback) => {
  devtools.api.on.customTabsUpdated((payload) => {
    callback(payload)
  })
})

export const onCustomCommandsUpdated = defineDevToolsListener<CustomCommand[]>('devtools:on-custom-commands-updated', (devtools, callback) => {
  devtools.api.on.customCommandsUpdated((payload) => {
    callback(payload)
  })
})

export const onInspectorTreeUpdated = defineDevToolsListener<{ inspectorId: string, data: ComponentTreeNode[] }>('devtools:on-inspector-tree-updated', (devtools, callback) => {
  devtools.api.on.sendInspectorTree((payload) => {
    callback(payload)
  })
})

export const onInspectorStateUpdated = defineDevToolsListener<{ inspectorId: string, state?: any[], getters?: any[] }>('devtools:on-inspector-state-updated', (devtools, callback) => {
  devtools.api.on.sendInspectorState((payload) => {
    callback(payload)
  })
})

export const onComponentUpdated = defineDevToolsListener<{ inspectorId: string, state?: any[], getters?: any[] }>('devtools:on-component-updated', (devtools, callback) => {
  devtools.api.on.componentUpdated(() => {
    callback()
  })
})

export const onEditInspectorState = defineDevToolsListener<{ inspectorId: string, state?: any[], getters?: any[] }>('devtools:on-edit-inspector-state', (devtools, callback) => {
  devtools.api.on.editInspectorState(async (payload) => {
    await callback(payload)
  })
})

export const onRouterInfoUpdated = defineDevToolsListener<any>('devtools:on-router-info-updated', (devtools, callback) => {
  devtools.api.on.routerInfoUpdated((payload) => {
    callback(payload)
  })
}, { parser: 'json' })

export const onAddTimelineEvent = defineDevToolsListener<TimelineEvent>('devtools:on-add-timeline-event', (devtools, callback) => {
  devtools.api.on.addTimelineEvent((payload) => {
    callback(payload)
  })
})
