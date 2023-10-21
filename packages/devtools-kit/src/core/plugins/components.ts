import type { VueAppInstance } from '@vue-devtools-next/schema'
import { setupDevToolsPlugin } from '../../api/plugin'
import { getComponentInstance } from '../component/general'
import { devtoolsContext } from '../general/state'
import { ComponentWalker } from '../component/tree/walker'
import { getInstanceState } from '../component/state'
import { DevToolsEvents, apiHooks } from '../../api/on'

const INSPECTOR_ID = 'components'

export function registerComponentsDevTools(app: VueAppInstance) {
  setupDevToolsPlugin({
    id: INSPECTOR_ID,
    label: 'Components',
    app,
  }, (api) => {
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
  })
}
