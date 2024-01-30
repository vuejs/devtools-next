import { devtools } from '@vue/devtools-kit-next'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { resetDevToolsState } from '../src/state'
import App from './fixtures/App.vue'

describe('hook', () => {
  beforeAll(() => {
    devtools.init()
  })
  afterEach(() => {
    resetDevToolsState()
  })
  it('should work w/ app init hook', async () => {
    await new Promise<void>((resolve) => {
      devtools.hook.on.vueAppInit((app, version) => {
        expect(app).toBeTypeOf('object')
        expect(version).toBeTypeOf('string')
        resolve()
      })
      mount(App, {
        attachTo: document.body,
      })
    })
  })

  it('should work w/ component updated hook', async () => {
    await new Promise<void>((resolve) => {
      devtools.hook.on.componentUpdated((_, __, ___, component) => {
        expect(component.setupState.count).toBe(10)
        resolve()
      })

      const app = mount<{}, { }, { count: number, visible: boolean }>(App, {
        attachTo: document.body,
      })
      app.vm.count = 10
    })
  })
})
