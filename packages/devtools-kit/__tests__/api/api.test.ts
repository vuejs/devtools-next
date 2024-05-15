import { devtools } from '@vue/devtools-kit'
import { mount } from '@vue/test-utils'
import type { Plugin } from 'vue'
import { devtoolsAppRecords, resetDevToolsContext, resetDevToolsState } from '../../src/state'

import { DevToolsPluginApi } from '../../src/api'
import { onDevToolsConnected, setupDevToolsPlugin } from '../../src'
import { DevToolsHooks } from '../../src/types'
import App from '../fixtures/App.vue'

function createDevToolsPlugin(fn: (api: DevToolsPluginApi) => void): Plugin {
  return {
    install(app) {
      setupDevToolsPlugin({
        id: `devtools-test`,
        label: 'Hi DevTools',
        app,
      }, fn)
    },
  }
}

describe('devtools api', () => {
  beforeAll(() => {
    devtools.init()
  })
  afterEach(() => {
    resetDevToolsState()
    resetDevToolsContext()
  })
  it('should work w/ addTimelineLayer api', async () => {
    await new Promise<void>((resolve) => {
      const timelineLayerData = {
        id: 'layer',
        label: 'Layer',
        color: 0x92A2BF,
      }
      devtools.hook.on.vueAppInit(() => {
        vi.waitFor(
          () => {
            expect(devtools.context.timelineLayer).toEqual([timelineLayerData])
            resolve()
          },
        )
      })
      mount(App, {
        attachTo: document.body,
        global: {
          plugins: [createDevToolsPlugin((api) => {
            api.addTimelineLayer(timelineLayerData)
          })],
        },
      })
    })
  })

  it('should work w/ addTimelineEvent api', async () => {
    await new Promise<void>((resolve) => {
      const timelineEventData = {
        event: {
          groupId: 1,
          time: 100000000,
          title: 'title',
          subtitle: 'subtitle',
          data: {},
        },
        layerId: 'layer',
      }

      onDevToolsConnected(() => {
        devtools.api.on.addTimelineEvent((payload) => {
          expect(payload).toEqual(timelineEventData)
          resolve()
        })
      })

      mount(App, {
        attachTo: document.body,
        global: {
          plugins: [createDevToolsPlugin((api) => {
            onDevToolsConnected(() => {
              setTimeout(() => {
                api.addTimelineEvent(timelineEventData)
              })
            })
          })],
        },
      })
    })
  })

  it('should work w/ addInspector api', async () => {
    await new Promise<void>((resolve) => {
      // Originated from https://github.com/vuejs/devtools-next/blob/main/packages/devtools-kit/src/plugins/component.ts#L20-L24
      const componentInspector = {
        id: 'components',
        nodeActions: [],
        actions: [],
        nodeId: '',
        filter: '',
        treeFilterPlaceholder: 'Search components',
      }
      const inspectorData = {
        id: 'vueuse',
        label: 'VueUse',
        actions: [],
        nodeActions: [],
        nodeId: '',
        filter: '',
        treeFilterPlaceholder: 'Search',
      }
      devtools.hook.on.vueAppInit(() => {
        vi.waitFor(
          () => {
            const { label, ...inspectorDataWithoutLabel } = inspectorData
            expect(devtools.context.inspector).toEqual([inspectorDataWithoutLabel, componentInspector])
            resolve()
          },
        )
      })
      mount(App, {
        attachTo: document.body,
        global: {
          plugins: [createDevToolsPlugin((api) => {
            api.addInspector(inspectorData)
          })],
        },
      })
    })
  })

  it('legacy plugin can be registered after app is created', async () => {
    // Refs: #247
    await new Promise<void>((resolve) => {
      const setupFn = vitest.fn()
      const globalHook = __VUE_DEVTOOLS_GLOBAL_HOOK__

      mount(App, {
        attachTo: document.body,
      })

      onDevToolsConnected(() => {
        const { app, api } = devtoolsAppRecords.active
        expect(setupFn).not.toHaveBeenCalled()
        globalHook.emit(DevToolsHooks.SETUP_DEVTOOLS_PLUGIN, { app }, setupFn)

        vi.waitFor(() => {
          expect(setupFn).toBeCalledWith(api)
          resolve()
        })
      })
    })
  })
})
