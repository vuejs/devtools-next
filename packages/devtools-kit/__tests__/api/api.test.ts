import { devtools } from '@vue/devtools-kit'
import { mount } from '@vue/test-utils'
import type { Plugin } from 'vue'
import { resetDevToolsContext, resetDevToolsState } from '../../src/state'

import { DevToolsPluginApi } from '../../src/api'
import { onDevToolsConnected, setupDevToolsPlugin } from '../../src'
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
        setTimeout(() => {
          expect(devtools.context.timelineLayer).toEqual([timelineLayerData])
          resolve()
        }, 100)
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
      const inspectorData = {
        id: 'vueuse',
        label: 'VueUse',
        nodeId: '',
        filter: '',
        treeFilterPlaceholder: 'Search',
      }
      devtools.hook.on.vueAppInit(() => {
        setTimeout(() => {
          expect(devtools.context.inspector).toEqual([inspectorData])
        }, 100)
        resolve()
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
})
