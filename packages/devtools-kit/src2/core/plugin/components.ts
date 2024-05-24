import type { App, PluginDescriptor, PluginSetupFunction } from '../../types'
// import { hook } from '../hook'
import { getAppRecord, getComponentId, getComponentInstance } from '../../core/component/utils'
import { activeAppRecord } from '../../ctx'
import { ComponentWalker } from '../../core/component/tree/walker'

const INSPECTOR_ID = 'components'

export function createComponentsDevToolsPlugin(app: App): [PluginDescriptor, PluginSetupFunction] {
  const descriptor: PluginDescriptor = {
    id: INSPECTOR_ID,
    label: 'Components',
    app,
  }

  const setupFn: PluginSetupFunction = (api) => {
    api.addInspector({
      id: INSPECTOR_ID,
      label: 'Components',
      treeFilterPlaceholder: 'Search components',
    })

    api.on.getInspectorTree(async (payload) => {
      if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
        // @ts-expect-error skip type @TODO
        const instance = getComponentInstance(activeAppRecord.value!, payload.instanceId)
        if (instance) {
          const walker = new ComponentWalker({
            filterText: payload.filter,
            // @TODO: should make this configurable?
            maxDepth: 100,
            recursively: false,
          })
          // @ts-expect-error skip type @TODO
          payload.rootNodes = await walker.getComponentTree(instance)
        }
      }
    })

    // @TODO: on getComponentBoundingRect
    console.log('api', api)
  }

  return [descriptor, setupFn]
}
