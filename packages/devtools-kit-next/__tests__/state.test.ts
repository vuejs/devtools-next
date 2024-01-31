import { devtools } from '@vue/devtools-kit-next'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { resetDevToolsState } from '../src/state'
import App from './fixtures/App.vue'

describe('app record', () => {
  beforeAll(() => {
    devtools.init()
  })
  afterEach(() => {
    resetDevToolsState()
  })
  it('should work', async () => {
    await new Promise<void>((resolve) => {
      devtools.hook.on.vueAppInit(() => {
        const records = devtools.state.appRecords
        expect(records.length).toBe(1)
        expect(devtools.state.connected).toBe(true)
        resolve()
      })
      mount(App, {
        attachTo: document.body,
      })
    })
  })
})
