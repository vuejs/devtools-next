import { devtools } from '@vue/devtools-kit'
import { createHooks } from 'hookable'

const hooks = createHooks()
const apiHooks = createHooks()

export const functions = {
  on: (event: string, handler: Function) => {
    hooks.hook(event, handler)
  },
  off: (event: string, handler: Function) => {
    hooks.removeHook(event, handler)
  },
  once: (event: string, handler: Function) => {
    hooks.hookOnce(event, handler)
  },
  emit: (event: string, ...args: any[]) => {
    hooks.callHook(event, ...args)
  },
  api: {
    on: (event: string, handler: Function) => {
      apiHooks.hook(event, handler)
    },
    off: (event: string, handler: Function) => {
      apiHooks.removeHook(event, handler)
    },
    once: (event: string, handler: Function) => {
      apiHooks.hookOnce(event, handler)
    },
    emit: (event: string, ...args: any[]) => {
      apiHooks.callHook(event, ...args)
    },
  },
  heartbeat: () => ({}),
  devtoolsState: () => {
    return {
      connected: devtools.state.connected,
      clientConnected: devtools.state.clientConnected,
      vueVersion: devtools.state?.activeAppRecord?.version || '',
      tabs: devtools.state.tabs,
      commands: devtools.state.commands,
      vitePluginDetected: devtools.state.vitePluginDetected,
      appRecords: devtools.state.appRecords.map(item => ({
        id: item.id,
        name: item.name,
        version: item.version,
        routerId: item.routerId,
        moduleDetectives: item.moduleDetectives,
      })),
      activeAppRecordId: devtools.state.activeAppRecordId,
    }
  },
}

export type RPCFunctions = typeof functions
