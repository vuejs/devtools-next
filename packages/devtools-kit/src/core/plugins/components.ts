import type { VueAppInstance } from '@vue-devtools-next/schema'
import { setupDevToolsPlugin } from '../../api/plugin'
import { getAppRecord, getComponentId, getComponentInstance } from '../component/general'
import { devtoolsContext } from '../general/state'
import { ComponentWalker } from '../component/tree/walker'
import { getInstanceState } from '../component/state'
import { DevToolsEvents, apiHooks } from '../../api/on'
import { hook } from '../general/hook'

const INSPECTOR_ID = 'components'

export function registerComponentsDevTools(app: VueAppInstance) {
  setupDevToolsPlugin({
    id: INSPECTOR_ID,
    label: 'Components',
    app,
  }, (api) => {
    api.addInspector({
      id: INSPECTOR_ID,
      label: 'Components',
      treeFilterPlaceholder: 'Search components',
    })

    api.on.getInspectorTree(async (payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const instance = getComponentInstance(devtoolsContext.appRecord!, payload.instanceId)
        if (instance) {
          const walker = new ComponentWalker({
            filterText: payload.filter,
            // @TODO: should make this configurable?
            maxDepth: 100,
            recursively: false,
          })
          payload.rootNodes = await walker.getComponentTree(instance)
        }
      }
    })

    api.on.getInspectorState(async (payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        const result = getInstanceState({
          instanceId: payload.nodeId,
        })
        const componentInstance = result.instance
        const app = result.instance?.appContext.app
        const _payload = {
          componentInstance,
          app,
          instanceData: result,
        }
        // @ts-expect-error hookable
        apiHooks.callHookWith((callbacks) => {
          callbacks.forEach(cb => cb(_payload))
        }, DevToolsEvents.COMPONENT_STATE_INSPECT)
        payload.state = result
      }
    })

    hook.on.componentAdded(async (app, uid, parentUid, component) => {
      if (app?._instance?.type?.devtools?.hide)
        return

      if (!app || (typeof uid !== 'number' && !uid) || !component)
        return

      const id = await getComponentId({
        app,
        uid,
        instance: component,
      }) as string
      const appRecord = await getAppRecord(app)

      if (component) {
        if (component.__VUE_DEVTOOLS_UID__ == null)
          component.__VUE_DEVTOOLS_UID__ = id

        if (!appRecord?.instanceMap.has(id))
          appRecord?.instanceMap.set(id, component)
      }

      if (!appRecord)
        return

      api.sendInspectorTree(INSPECTOR_ID)
    })

    hook.on.componentUpdated(async (app, uid, parentUid, component) => {
      if (app?._instance?.type?.devtools?.hide)
        return

      if (!app || (typeof uid !== 'number' && !uid) || !component)
        return

      const id = await getComponentId({
        app,
        uid,
        instance: component,
      }) as string
      const appRecord = await getAppRecord(app)

      if (component) {
        if (component.__VUE_DEVTOOLS_UID__ == null)
          component.__VUE_DEVTOOLS_UID__ = id

        if (!appRecord?.instanceMap.has(id))
          appRecord?.instanceMap.set(id, component)
      }

      if (!appRecord)
        return

      api.sendInspectorTree(INSPECTOR_ID)
      api.sendInspectorState(INSPECTOR_ID)
    })
    hook.on.componentRemoved(async (app, uid, parentUid, component) => {
      if (app?._instance?.type?.devtools?.hide)
        return

      if (!app || (typeof uid !== 'number' && !uid) || !component)
        return

      const appRecord = await getAppRecord(app)

      if (!appRecord)
        return

      const id = await getComponentId({
        app,
        uid,
        instance: component,
      }) as string
      appRecord?.instanceMap.delete(id)

      api.sendInspectorTree(INSPECTOR_ID)
    })
  })
}
